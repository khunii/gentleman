# Gentleman
## swagger2-postman-generator 모듈을 활용한 Postman collection provider

- Postman collection 단위를 개인에게 초기 셋업하기 위해 사용하기 위함
- [데모사이트 : http://magoktqa.net:9900](http://magoktqa.net:9900/)

## Feature
- swagger를 통한 collection생성
- collection 명 중복 방지
- environment 동시 다운로드
- pre, post 스크립트 지정하여 collection에 삽입
  
## Getting started

```bash
# 1. clone this repository
git clone https://magoktqa.net:9443/tqa/gentleman.git

# 2. clone된 폴더로 이동
cd 내폴더명(예: gentleman)

# 3. port 설정
vi env.dev 후 PORT value 편집하면 됨

# 4. dependency install
npm install

# 5. run app
npm start
```


### npm , node 설치 [다운로드](https://nodejs.org/en/)

- Windows는 설치파일 다운로드 받아서 wizard에 따라 진행
- 리눅스는 우분투 18.04LTS 기준으로 아래 설명(1,2번 둘중하나로 진행)
1. installing Node.js From Ubuntu 18.04 Repository
  ```bash
  $ sudo apt update
  $ sudo apt install nodejs
  $ sudo apt install npm
  ```
2. installing Node.js from NodeSource Reposiotry
- [Nodejs 버전확인 후](https://nodejs.org/en/) 아래에서 setupe_13.x 를 버전에 맞는 숫자로 고치고 진행

```bash
$ sudo apt-get update
$ curl -sL https://deb.nodesource.com/setup_13.x | sudo bash -
$ sudo apt install nodejs
 ```

- 설치 확인
```bash
$ node --version or node -v
$ npm --version or npm -v
```
