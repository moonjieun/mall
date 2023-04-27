import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut ,onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get ,remove} from "firebase/database";
import { v4 as uuid } from 'uuid';

const firebaseConfig = {
    apiKey:process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain:process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL:process.env.REACT_APP_FIREBASE_DB_URL,
    projectId:process.env.REACT_APP_FIREBASE_PROJECT_ID,
  };
 
  console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const database = getDatabase(app);


/**로그인 명령형 함수 */
export function login(){
signInWithPopup(auth, provider).catch(console.error);
 }

//자동로그인 방지
provider.setCustomParameters({ prompt: "select_account",});

/**로그아웃 명령형 함수 */
export function logout(){
   signOut(auth).catch(console.error);
  }

/**로그인, 로그아웃 결과값받는함수 */
export function onUserStateChange(callback){
 onAuthStateChanged(auth, async (user) => {
 const updatedUser = user ? await adminUser(user) : null;
 callback(updatedUser);
});
}

/**상품관리권한 체크  */
async function adminUser(user){
  return get(ref(database,'admins'))
  .then((snapshot)=>{
    if(snapshot.exists()){
      const admins = snapshot.val();
      console.log (admins);
      const isAdmin = admins.includes(user.uid);
      return {...user, isAdmin}
    }
    return user;
  });
}

/**firebase db/products에 상품등록 */
export async function addNewProduct(product,url){
  const id = uuid();

  return set(ref(database,`products/${id}`),{
   ...product,
   id,
   price: parseInt(product.price),
   image: url,
  });
}

/**firebase db/products에서 값가져오기*/
export async function getProducts(){
  return get(ref(database,'products')).then(snapshot => {
    if(snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  })
}

/**firebase db/carts에 값가져오기 */
export async function getCart(userId) {
  return get(ref(database, `carts/${userId}`)) //
    .then((snapshot) => {
      const items = snapshot.val() || {};
      console.log(items);
      return Object.values(items);
    });
}

/**장바구니에 목록업데이트 */
export async function addOrUpdateToCart(userId, product) {
  return set(ref(database, `carts/${userId}/${product.id}`), product);
  
}
/**장바구니에 목록삭제 */
export async function removeFromCart(userId, productId) {
  return remove(ref(database, `carts/${userId}/${productId}`));
}

