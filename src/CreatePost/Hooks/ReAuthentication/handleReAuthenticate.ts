/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    auth,
    //signInWithEmailAndPassword,
    googleProvider,
    twitterProvider, githubProvider,
    signInWithPopup,
    reauthenticateWithCredential,
    EmailAuthProvider
} from '../../Config/firebase'


const handleSignInWithEmail = async (currentUser: any, existingEmail: string, password: string, setEmailModal: any) => {
    if (currentUser) {
        try {
            const credential = EmailAuthProvider.credential(
                existingEmail,
                password
            );
            await reauthenticateWithCredential(currentUser, credential)
            //await signInWithEmailAndPassword(auth, existingEmail, password)
            setEmailModal(false)
            alert('Password confirmed successfully')
        } catch (error: any) {
            console.log(error)
            alert(error.message)
        }
    }
}

const handleAutoSignInWithGoogle = async (currentUser: any, existingEmail: string, setGoogleModal: any) => {
    if (currentUser) {
        try {
            googleProvider.setCustomParameters({ login_hint: existingEmail });
            await signInWithPopup(auth, googleProvider)
            setGoogleModal(false)
            alert('Re-authenticated with Google successfully')
        } catch (error: any) {
            console.log(error)
            alert(error.message)
        }
    }
}

const handleAutoSignInWithTwitter = async (currentUser: any, existingEmail: string, setTwitterModal: any) => {
    if (currentUser) {
        try {
            twitterProvider.setCustomParameters({ login_hint: existingEmail });
            await signInWithPopup(auth, twitterProvider)
            setTwitterModal(false)
            alert('Re-authenticated with Twitter successfully')
        } catch (error: any) {
            console.log(error)
            alert(error.message)
        }
    }
}

const handleAutoSignInWithGitHub = async (currentUser: any, existingEmail: string, setGitHubModal: any) => {
    if (currentUser) {
        try {
            githubProvider.setCustomParameters({ login_hint: existingEmail });
            await signInWithPopup(auth, githubProvider)
            setGitHubModal(false)
            alert('Re-authenticated with Github successfully')
        } catch (error: any) {
            console.log(error)
            alert(error.message)
        }
    }
}


export {
    handleSignInWithEmail,
    handleAutoSignInWithGoogle,
    handleAutoSignInWithTwitter,
    handleAutoSignInWithGitHub
}