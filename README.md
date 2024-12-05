## 📝 프로젝트 소개

안녕하세요 😆

"아무 말 대잔치"는 전형적인 커뮤니티 웹 페이지입니다!

<br>

## 🚀 Demo

<div align="center">
  <table>
    <tr align="center">
      <th>로그인</th>
      <th>회원가입</th>
      <th>프로필</th>
    </tr>
    <tr>
      <td><img src=https://github.com/user-attachments/assets/3dcc0137-8db8-4898-b0de-e1dadf910f4b alt="gif-function1" width="370"></td>
      <td><img src=https://github.com/user-attachments/assets/1da8db6d-5a9d-465d-8b18-d9b04ad2083d alt="gif-main-page" width="370"></td>
      <td><img src=https://github.com/user-attachments/assets/5a50f8df-128b-4456-bfd7-4512d4056c6d alt="git-fuction1" width="370"></td>
    </tr>
    <tr align="center">
      <th>게시글 목록</th>
      <th>상세 게시글</th>
      <th>게시글 작성</th>
    </tr>
    <tr>
      <td><img src=https://github.com/user-attachments/assets/c323a81c-923e-48c6-a280-3c092b092a18 alt="gif-function3" width="370"></td>
      <td><img src=https://github.com/user-attachments/assets/d2eb800e-34ad-4a79-97cf-e4ccb701717a alt="gif-function3" width="370"></td>
       <td><img src=https://github.com/user-attachments/assets/f51c385d-7bdd-4c13-b9ab-bad9357817cd alt="gif-function2" width="370"></td>
    </tr>
  </table>
</div>
<br>

> **아무 말 대잔치** 의 **기능**에 대해 더 자세하게 알고 싶다면, [**데모 영상**]()을 시청해보세요 <br>

<p style="color:#cccccc40">데모 영상 링크 추후 변경 예정</p>

<br>

## 📚 주요 기능

#### 유저 관리

-   로그인 (세션 기반 인증 및 인가)
-   회원가입
-   비밀번호 수정
-   회원 정보 수정
-   회원 탈퇴

#### 커뮤니티 관리

-   게시글 작성, 수정, 삭제
-   댓글 작성, 수정, 삭제
-   조회수 업데이트
-   좋아요 기능

<br>

## 📙 시작 가이드

### 💻 [Frontend](https://github.com/100-hours-a-week/2-sen-noh-community-fe)

```
 $ git clone https://github.com/100-hours-a-week/2-sen-noh-community-fe.git
 $ cd 2-sen-noh-community-fe/
 $ node express.js
```

http://localhost:3002/로 접속

### 🗃️ [Backend](https://github.com/100-hours-a-week/2-sen-noh-community-be)

```
 $ git clone https://github.com/100-hours-a-week/2-sen-noh-community-be.git
 $ cd 2-sen-noh-community-be/
 $ node app.js
```

<br>

## 🛠️ Tech Stacks

<div align="">
<table>
    <tr>
    <td style="width : 500px">
      <h3>💻 Frontend</h3>
      <ul>
        <li>
          <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat-square" alt="JavaScript">
        </li>
        <li>
          <img src="https://img.shields.io/badge/-HTML-E34F26?logo=html5&logoColor=white&style=flat-square" alt="HTML">
        </li>
        <li>
          <img src="https://img.shields.io/badge/-CSS-1572B6?logo=css3&logoColor=white&style=flat-square" alt="CSS">
        </li>
      </ul>
    </td>
    <td style="width:50%">
      <h3>🗃️ Backend</h3>
      <ul>
        <li>
          <img src="https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat-square" alt="Node.js">
        </li>
        <li>
          <img src="https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white&style=flat-square" alt="Express.js">
        </li>
        <li>
          <img src="https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white&style=flat-square" alt="MySQL">
        </li>
      </ul>
    </td>
  </tr>
</table>
</div>

<br>

## 📂 Project Structure

```
📦2-sen-noh-community-be
 ┣ 📂controllers
 ┃ ┣ 📜authController.js
 ┃ ┣ 📜commentController.js
 ┃ ┣ 📜postController.js
 ┃ ┗ 📜userController.js
 ┣ 📂middlewares
 ┃ ┣ 📜cors.js
 ┃ ┣ 📜csp.js
 ┃ ┣ 📜logger.js
 ┃ ┣ 📜rateLimit.js
 ┃ ┣ 📜session.js
 ┃ ┣ 📜timeout.js
 ┃ ┗ 📜upload.js
 ┣ 📂models
 ┃ ┣ 📜authModel.js
 ┃ ┣ 📜commentModel.js
 ┃ ┣ 📜postModel.js
 ┃ ┗ 📜userModel.js
 ┣ 📂routes
 ┃ ┣ 📜authRoutes.js
 ┃ ┣ 📜commentRoutes.js
 ┃ ┣ 📜middlewareRoutes.js
 ┃ ┣ 📜postRoutes.js
 ┃ ┗ 📜userRoutes.js
 ┣ 📂services
 ┃ ┣ 📜authService.js
 ┃ ┣ 📜commentService.js
 ┃ ┣ 📜postService.js
 ┃ ┗ 📜userService.js
 ┣ 📜.gitignore
 ┣ 📜.prettierignore
 ┣ 📜README.md
 ┣ 📜app.js
 ┣ 📜db.js
 ┣ 📜eslint.config.js
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┗ 📜prettier.config.mjs
```

---
