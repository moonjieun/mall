# [runz.](https://sparkling-fudge-c32123.netlify.app/) 
  🔼 클릭시 사이트 이동

### 운동복 쇼핑몰 홈페이지 (개인프로젝트)

<br>
<br>

# 📝프로젝트 정보

### 💡 개발기간

- 2023.03.29 ~ 2023.04.27
  <br>
  <br>

### 🔨 프로젝트에 사용된 기술<br>

<img src="https://img.shields.io/badge/React-17202C?style=for-the-badge&logo=react&logoColor=61DAFB"/> <img src="https://img.shields.io/badge/Reactquery-FFFFFF?style=for-the-badge&logo=Reactquery&logoColor=FF4154"/> <img src="https://img.shields.io/badge/hmtl5-E34F26?style=for-the-badge&logo=HTML5&logoColor=FFFFFF"/> <img src="https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=FFFFFF"/> <img src="https://img.shields.io/badge/javascript-191A1B?style=for-the-badge&logo=javascript&logoColor=F7DF1E"/> <img src="https://img.shields.io/badge/firebase-008CD7?style=for-the-badge&logo=firebase&logoColor=FFCA28"/> <img src="https://img.shields.io/badge/tailwind css-FFFFFF?style=for-the-badge&logo=tailwind css&logoColor=06B6D4"/>
<br>
<br>

### 📎 홈페이지 구성

- Home
- Product Detail Page
- My Cart
- New Product ( admin권한이 있는 사용자만 보이는 페이지 ) 관리자만 새상품 등록
- Login, Logout ( 구글계정 로그인 )
  <br>
  <br>

# 🔎 핵심 기능보기 

## **1. 로그인 로그아웃 기능**

❗ 오류 사항
<br>
Navbar에서 `useState`등록 | `useEffect`을 통해 user정보를 Component에 등록하였더니, 페이지 리로딩시 정보 초기화 유저정보를 가지고있지 못하는 오류가 발생하였습니다.

- 수정 내용
  <br>
  Context Api 이용해 user를 등록
  Navbar에서 `useAuthContext`로 <AuthContext.Provider/>로 감싼 컴포넌트에서 데이터를 받을 수 있도록 설정 하였고,
  리로딩시에도 유저정보 보관

<details>
<summary>💬코드보기</summary>

```js
/**로그인, 로그아웃 결과값받는함수 */
export function onUserStateChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    const updatedUser = user ? await adminUser(user) : null;
    callback(updatedUser);
  });
}
```

</details>

＊ `login(), logout()`은 명령형 함수로만 이용

<br>

## **2. 로그인시 어드민권한 확인**

- _어드민 사용자 경로보호_ index.js `<ProtectedRoute/>`사용하여
  ProtectedRoute.jsx Component에서 조건을 체크한뒤 route를이용해 새상품등록페이지로 이동할 수 있게하였습니다.( 로그인한 사용자확인, 어드민권한체크 )
<summary>>💬코드보기</summary>
```js
import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({children, requireAdmin}){
    const { user } = useAuthContext();
   console.log(user,'나 라우터페이지임 유저정보 뜨는지 좀')
   if(user===undefined){
    return <>로딩중</>;
 } else if (user === null || (requireAdmin && user.isAdmin===false)) {
    return <Navigate to={"/"} replace={true} />;
 } else {
    return children;
 }
}

//로그인한 사용자가 있는지확인
//사용자가 어드민 권한이 있는지 확인
//requireAdmin이 true인 경우에는 로그인도 되어있어야하고, 어드민 권한도 가지고 있어야함\
//조건이 불충족할경우 / 상위 경로로 이동
//조건이 충족된경우 전달된 chidren을 보여줌
```
## 실행화면
<img width="65%" src="https://github.com/moonjieun/mall/assets/102341066/7add2b39-ef11-4720-9c38-b2942870577d"/>

<details>
<summary>💬코드보기</summary>

```js
/**상품관리권한 체크  */
//firebase/admins에 미리 권한을줄 uid를 등록
async function adminUser(user) {
  return get(ref(database, "admins")).then((snapshot) => {
    if (snapshot.exists()) {
      const admins = snapshot.val();
      console.log(admins);
      const isAdmin = admins.includes(user.uid);
      return { ...user, isAdmin };
    }
    return user;
  });
}
```

</details>
<br>

## **3.  `custom hook`, `useMutation`의 사용**

<br>
📝 (수정전) 데이터 가져오기

```js
const {
  isLoading,
  error,
  data: products,
} = useQuey(["products"], getProducts, { staleTime: 1000 * 60 });
```

<br>

- (수정후) `custom hook` 사용 후 코드리팩토링 ✨

```js
const {
  productsQuery: { isLoading, error, data: products },
} = useProducts();
```

`reactQuery` 유지보수 용이, UI/business 로직 분리하기 위해 `custom hook`을 이용해 요청/ 업데이트를 한곳에서 관리하게 수정하였습니다.

<br>

## **4. 장바구니 뱃지 표시지연 수정**

### 📑 개선사항<br>
장바구니에 담긴 개수를 바로 확인하지 못하였으나, firebase파일함수를 **component에서 사용하지않고**
**custom hook에서 함수를 받아와** `mutate(정보)`를 이용해 전달 -> 서버에서 데이터를 재호출해 최신상태로 업데이트
<br>

## 💡 개선 후 실행화면
<img width="65%" src="https://github.com/moonjieun/mall/assets/102341066/c7f66947-5ac6-4c1a-8da7-f6f9533f98a5"/>
<br/>

**cart custom hook 코드**

<details>
<summary>💬자세히보기</summary>

```js
export default function useCart() {
  const queryClient = useQueryClient();

  const { uid } = useAuthContext();
  /**사용자별로 캐시 사용자가 있는경우에만 apiquery사용 */
  const cartQuery = useQuery(["carts", uid || ""], () => getCart(uid), {
    enabled: !!uid,
  });

  const addOrUpdateItem = useMutation(
    (product) => addOrUpdateToCart(uid, product),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["carts", uid]);
      },
    }
  );

  const removeItem = useMutation((id) => removeFromCart(uid, id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["carts", uid]);
    },
  });

  return { cartQuery, addOrUpdateItem, removeItem };
}
```

</details>

<br>

## **5. map함수 사용**

```js
<ul className="grid grid-cols-1 md:grid-cols-3 lg-grid-cols-4 gap-4 p-4">
  {products &&
    products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
</ul>
```

<br>

## **6. cloudinary에서 REST API를 이용해 이미지 업로드**

```js
export async function uploadImage(file) {
  const data = new FormData();

  data.append("file", file);
  //secret key => .env
  data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
  return fetch(process.env.REACT_APP_CLOUDINARY_URL, {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((data) => data.url);
}
```

- 여기서 이미지URL을 받아와 firbase에 파일형태 X => url형태로 추가하였습니다.

<br>
