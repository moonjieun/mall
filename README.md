# [runz.](https://sparkling-fudge-c32123.netlify.app/)

### 운동복 쇼핑몰 홈페이지 개인프로젝트

<br>
<br>

# 📝프로젝트 정보

<br>

### 💡 개발기간

- 2023.02.28 ~ 2023.04.25
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
- New Product ( admin권한이 있는 사용자만 보이는 페이지 )
- Login, Logout ( 구글계정 로그인 )
  <br>
  <br>

# 🔎 핵심 기능보기 🔎

## **1. 로그인 로그아웃 기능**

❗ 오류 사항
<br>
Navbar에서 `useState`등록 | `useEffect`을 통해 user정보를 Component에 등록하였더니, 페이지 리로딩시 정보 초기화 유저정보를 가지고있지 못함.

- 수정
  <br>
  Context Api 이용해 user를 등록
  Navbar에서 `useAuthContext`로 <AuthContext.Provider/>로 감싼 컴포넌트에서 데이터를 받을 수 있도록 설정
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

## **2. 로그인시 어드민권한 확인 (async await)**

- _어드민 사용자 경로보호_ index.js `<ProtectedRoute/>`사용하여
  ProtectedRoute.jsx Component에서 조건을 체크한뒤 route를이용해 새상품등록페이지로 이동할 수 있게함.( 로그인한 사용자확인, 어드민권한체크 )

## 실행화면

<img width="80%" src="https://user-images.githubusercontent.com/102341066/234918210-b60b230c-aa98-47d0-b60f-fd59b1fb723c.gif"/>
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

## **3. 새상품 등록**

관리자권한을 가진 유저가 새상품등록페이지에서 상품을 등록할시
input에 입력한 정보가 `change`, `submit`되었을때 정보를 전달 보관후 firebase에 담는다.

<details>
<summary>💬 상품등록페이지 코드보기</summary>

`NewProduct.jsx`

```js
const [product, setProduct] = useState({});
const [file, setFile] = useState();
const [isUploading, setIsUploading] = useState(false);
const [success, setSuccess] = useState();

const { addProduct } = useProducts();

const handleChange = (e) => {
  const { name, value, files } = e.target;
  if (name === "file") {
    setFile(files && files[0]);
    return;
  }
  setProduct((product) => ({ ...product, [name]: value }));
};

const handleSubmit = (e) => {
  e.preventDefault();
  setIsUploading(true);
  uploadImage(file) //
    .then((url) => {
      addProduct.mutate(
        { product, url },
        {
          onSuccess: () => {
            setSuccess("성공적으로 제품이 등록되었습니다.");
            setTimeout(() => {
              setSuccess(null);
            }, 4000);
          },
        }
      );
    })
    .finally(() => setIsUploading(false));
};
```

</details>

<details>
<summary>💬 firebase에 추가 코드보기</summary>

`firebase.js`

```js
/**firebase db/products에 상품등록 */
export async function addNewProduct(product, url) {
  const id = uuid();

  return set(ref(database, `products/${id}`), {
    ...product,
    id,
    price: parseInt(product.price),
    image: url,
  });
}
```

</details>
<br>

## **4. `useMutation`, `custom hook`의 사용**

<br>
📝 수정전 데이터 가져오기

```js
const {
  isLoading,
  error,
  data: products,
} = useQuey(["products"], getProducts, { staleTime: 1000 * 60 });
```

<br>

- `custom hook` 사용 후 코드리팩토링

```js
const {
  productsQuery: { isLoading, error, data: products },
} = useProducts();
```

`reactQuery` 유지보수 용이, UI/business 로직 분리하기 위해 `custom hook`을 이용해 요청/ 업데이트를 한곳에서 관리하게 수정

<br>

## **5. 장바구니 뱃지 표시지연 수정**

＊개선사항<br>
장바구니에 담긴 개수를 바로 확인하지 못하였으나, firebase파일함수를 **component에서 사용하지않고**
**custom hook에서 함수를 받아와** `mutate(정보)`를 이용해 전달 -> 서버에서 데이터를 재호출해 최신상태로 업데이트
<br>

## 개선 후 실행화면

<img width="80%" src="https://user-images.githubusercontent.com/102341066/234928290-e8c11c71-5fa5-4d8d-b79e-f4befdec521e.gif"/>

cart custom hook 코드

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

## **6. map함수 사용**

```js
<ul className="grid grid-cols-1 md:grid-cols-3 lg-grid-cols-4 gap-4 p-4">
  {products &&
    products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
</ul>
```

<br>

## **7. cloudinary에서 REST API를 이용해 이미지 업로드**

```js
export async function uploadImage(file) {
  const data = new FormData();

  data.append("file", file);
  //secret key => .env 파일에서 받아옴
  data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
  return fetch(process.env.REACT_APP_CLOUDINARY_URL, {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((data) => data.url);
}
```

- 여기서 이미지URL을 받아와 firbase에 파일형태 X => url형태로 추가

<br>
