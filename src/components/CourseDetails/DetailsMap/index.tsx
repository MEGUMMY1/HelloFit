import { useEffect, useRef } from 'react';
import { DetailsMapProps, GeocoderResult } from './DetailsMap.types';

export default function DetailsMap({
  address,
  radius = false,
  isNormal = true,
}: DetailsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

  useEffect(() => {
    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=services`;

    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        // 주소로 좌표 검색
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(
          address,
          (result: GeocoderResult[], status: string) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(
                result[0].y,
                result[0].x
              );

              const imageSrc = isNormal
                ? '/image/address-marker-normal.svg'
                : '/image/address-marker-special.svg';
              const imageSize = new window.kakao.maps.Size(40, 40);
              const imageOption = {
                offset: new window.kakao.maps.Point(20, 40),
              };

              const markerImage = new window.kakao.maps.MarkerImage(
                imageSrc,
                imageSize,
                imageOption
              );

              const marker = new window.kakao.maps.Marker({
                map: map,
                position: coords,
                image: markerImage,
              });

              marker.setMap(map);
              map.setCenter(coords);
            } else {
              console.error('주소 검색 실패:', status);
            }
          }
        );

        // 사용자의 현재 위치 지도에 표시
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const userCoords = new window.kakao.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
              );

              const imageSrc = isNormal
                ? '/image/my-location.svg'
                : '/image/my-location-special.svg';
              const imageSize = new window.kakao.maps.Size(40, 40);
              const imageOption = {
                offset: new window.kakao.maps.Point(20, 40),
              };

              const userMarkerImage = new window.kakao.maps.MarkerImage(
                imageSrc,
                imageSize,
                imageOption
              );

              const userMarker = new window.kakao.maps.Marker({
                map: map,
                position: userCoords,
                image: userMarkerImage,
                title: '현재 위치',
              });
              userMarker.setMap(map); // 마커를 지도에 추가
            },
            error => {
              console.error('현재 위치를 가져오는 데 실패했습니다:', error);
            }
          );
        }
      });
    };

    mapScript.addEventListener('load', onLoadKakaoMap);

    return () => {
      mapScript.removeEventListener('load', onLoadKakaoMap);
    };
  }, [address, isNormal, KAKAO_MAP_KEY]);

  return (
    <div
      id="map"
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: radius ? '12px' : '0',
      }}
    />
  );
}
