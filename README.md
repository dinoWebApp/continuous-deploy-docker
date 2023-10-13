# 배포 자동화 프로그램

개인 프로젝트의 배포 자동화를 위해 제작한 프로그램

## 사용한 메인 라이브러리

- nestjs v9

## 배포 및 아키텍처

<img src=./images/cd-archImg.png>

- 리눅스에 nginx 웹서버 구축
- 도커라이징 후 컨테이너로 실행하여 웹서버를 통해 배포
- DockerHub Webhooks 의 REST API 호출을 통해 컨테이너 재시작 명령 실행

## Contact

Email : <kgjsmart1559@gmail.com>
