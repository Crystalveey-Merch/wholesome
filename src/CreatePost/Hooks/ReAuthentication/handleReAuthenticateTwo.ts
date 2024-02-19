/* eslint-disable @typescript-eslint/no-explicit-any */
//This is the one used for email and password in settings
import {
    auth,
    //signInWithEmailAndPassword,
    googleProvider,
    twitterProvider, githubProvider,
    signInWithPopup,
    reauthenticateWithCredential,
    EmailAuthProvider
} from '../../Config/firebase'


const handleSignInWithEmailTwo = async (currentUser: any, existingEmail: string, password: string, setEmailModal: any, setShowEmailInfo: any) => {
    if (currentUser) {
        try {
            const credential = EmailAuthProvider.credential(
                existingEmail,
                password
            );
            await reauthenticateWithCredential(currentUser, credential)
            //await signInWithEmailAndPassword(auth, existingEmail, password)
            setEmailModal(false)
            setShowEmailInfo(true)
            alert('Password confirmed successfully')
        } catch (error: any) {
            console.log(error)
            alert(error.message)
        }
    }
}

const handleAutoSignInWithGoogleTwo = async (currentUser: any, existingEmail: string, setGoogleModal: any, setShowEmailInfo: any) => {
    if (currentUser) {
        try {
            googleProvider.setCustomParameters({ login_hint: existingEmail });
            await signInWithPopup(auth, googleProvider)
            setGoogleModal(false)
            setShowEmailInfo(true)
            alert('Re-authenticated with Google successfully')
        } catch (error: any) {
            console.log(error)
            alert(error.message)
        }
    }
}

const handleAutoSignInWithTwitterTwo = async (currentUser: any, existingEmail: string, setTwitterModal: any, setShowEmailInfo: any) => {
    if (currentUser) {
        try {
            twitterProvider.setCustomParameters({ login_hint: existingEmail });
            await signInWithPopup(auth, twitterProvider)
            setTwitterModal(false)
            setShowEmailInfo(true)
            alert('Re-authenticated with Twitter successfully')
        } catch (error: any) {
            console.log(error)
            alert(error.message)
        }
    }
}

const handleAutoSignInWithGitHubTwo = async (currentUser: any, existingEmail: string, setGitHubModal: any, setShowEmailInfo: any) => {
    if (currentUser) {
        try {
            githubProvider.setCustomParameters({ login_hint: existingEmail });
            await signInWithPopup(auth, githubProvider)
            setGitHubModal(false)
            setShowEmailInfo(true)
            alert('Re-authenticated with Github successfully')
        } catch (error: any) {
            console.log(error)
            alert(error.message)
        }
    }
}


export {
    handleSignInWithEmailTwo,
    handleAutoSignInWithGoogleTwo,
    handleAutoSignInWithTwitterTwo,
    handleAutoSignInWithGitHubTwo
}