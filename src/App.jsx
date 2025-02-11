import Front from './pages/Front.jsx'
import Dashboard from "./pages/Dashboard.jsx"
import Header from "./components/Header.jsx"
import SharePage from "./pages/SharePage.jsx"
import SignInPopup from './components/SignInPopup.jsx'
import MenuPopup from "./components/MenuPopup.jsx"
import VerifyBanner from "./components/VerifyBanner.jsx"
import { useEffect, useState, useRef } from 'react';
import {Routes, Route} from 'react-router-dom'
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, set } from 'firebase/database'; 

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

function App () {
    const [signInPopup, setSignInPopup] = useState(false)
    const [menuPopup, setMenuPopup] = useState(false)
    const [user, setUser] = useState(undefined)
    const [loadingAuth, setLoadingAuth] = useState(true)
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);
    const [phone, setPhone] = useState(false)

    useEffect(() => {
        setPhone(window.innerWidth < 768)

        window.addEventListener('resize', () => {
            if(window.innerWidth <= 768) {
                setPhone(true)
            } else {
                setPhone(false)
            }
        })

        onAuthStateChanged(auth, user => {
            setLoadingAuth(false)
            setUser(user)
        })
    }, [])

    useEffect(() => {
        if((menuPopup || signInPopup) && phone) {
            manageScroll(false)
        } else {
            manageScroll(true)
        }
    }, [menuPopup, signInPopup])

    function manageScroll (scroll) {
        document.body.style.overflow = !scroll ? "hidden" : ""

        const handleScrollEvent = (e) => {e.preventDefault(), { passive: false }}

        if(!scroll) {
            document.addEventListener('touchmove', handleScrollEvent);
        } else {
            document.removeEventListener('touchmove', handleScrollEvent);
        }
    }

    return (
        <div>
            <Routes>
                <Route path="/" element={<><Header phone={phone} user={user} setMenuPopup={setMenuPopup} setSignInPopup={setSignInPopup} /><Front database={database} auth={auth} user={user} /></>} />
                <Route path="/dashboard" element={<><VerifyBanner user={user} /><Dashboard loadingAuth={loadingAuth} database={database} verified={user?.emailVerified} user={user} auth={auth} phone={phone} /></>} />
                <Route path="/file/:fileID" element={<SharePage database={database} user={user} />} />
            </Routes>

            {signInPopup ? <SignInPopup phone={phone} auth={auth} setSignInPopup={setSignInPopup} /> : ""}
            {menuPopup ? <MenuPopup setMenuPopup={setMenuPopup} setSignInPopup={setSignInPopup} /> : ""}
        </div>
    );
}

export default App;