import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updatePassword
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

// --- CONFIGURAÇÃO ---
// Nota: Em produção, idealmente use variáveis de ambiente (.env)
const firebaseConfig = {
  apiKey: "AIzaSyBWx_mNRz9UHuKtmYsWPh9mN68fJu_-1qs",
  authDomain: "reta-final-af897.firebaseapp.com",
  projectId: "reta-final-af897",
  storageBucket: "reta-final-af897.firebasestorage.app",
  messagingSenderId: "25925122300",
  appId: "1:25925122300:web:387d0d3a04e1230194ff79",
  measurementId: "G-WG5FSL59F8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- TIPOS ---
interface UserData {
  email: string;
  tipo_plano: string;
  streak: number;
  lastActiveDate: string;
  hasSeenTutorial: boolean;
  hasChristmasAddon: boolean;
  requiresNewPassword?: boolean;
  createdAt: any;
}

// --- AUTH FUNCTIONS ---

export const loginUser = async (email: string, pass: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return { user: userCredential.user };
  } catch (error: any) {
    console.error("Erro Login:", error);
    let msg = "Erro ao entrar.";
    if (error.code === 'auth/invalid-credential') msg = "E-mail ou senha incorretos.";
    if (error.code === 'auth/user-not-found') msg = "Usuário não encontrado.";
    if (error.code === 'auth/wrong-password') msg = "Senha incorreta.";
    return { error: msg };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro Logout", error);
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error("Erro Reset Senha:", error);
    let msg = "Erro ao enviar e-mail.";
    if (error.code === 'auth/user-not-found') msg = "E-mail não cadastrado.";
    if (error.code === 'auth/invalid-email') msg = "E-mail inválido.";
    return { error: msg };
  }
};

export const updateUserPassword = async (newPassword: string) => {
  const user = auth.currentUser;
  if (!user) return { error: "Usuário não autenticado." };

  try {
    await updatePassword(user, newPassword);
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { requiresNewPassword: false }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar senha:", error);
    return { error: error.message || "Erro ao salvar senha." };
  }
};

// --- REGISTRO COM VALIDAÇÃO ROBUSTA DE CÓDIGO ---

export const registerWithCodeAndUserPass = async (email: string, pass: string, accessCode: string) => {
  // Normalização agressiva: Maiúsculas e sem espaços nas pontas
  const code = accessCode.toUpperCase().trim(); 
  
  console.log(`[AUTH] Iniciando registro para ${email} com código: "${code}"`);

  try {
    // ESTRATÉGIA 1: Buscar pelo CAMPO 'codigo' via Query
    const codesRef = collection(db, "codigos_acesso");
    const q = query(codesRef, where("codigo", "==", code)); 
    
    let codeDocSnap: any = null;
    let codeRef: any = null;

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        console.log("[AUTH] Código encontrado via Query.");
        codeDocSnap = querySnapshot.docs[0];
        codeRef = codeDocSnap.ref;
      }
    } catch (queryError: any) {
      console.warn("[AUTH] Falha na busca via Query (possível falta de índice ou permissão):", queryError.message);
      // Continua para Estratégia 2
    }

    // ESTRATÉGIA 2: Buscar pelo ID do documento (Fallback)
    if (!codeDocSnap) {
      console.log("[AUTH] Tentando buscar código pelo ID do documento...");
      const docRefById = doc(db, "codigos_acesso", code);
      const docSnapById = await getDoc(docRefById);
      
      if (docSnapById.exists()) {
        console.log("[AUTH] Código encontrado via ID.");
        codeDocSnap = docSnapById;
        codeRef = docRefById;
      }
    }

    // VERIFICAÇÃO FINAL
    if (!codeDocSnap) {
      console.error(`[AUTH] Código "${code}" não encontrado em nenhuma busca.`);
      return { error: "Código inválido ou inexistente." };
    }

    const codeData = codeDocSnap.data();
    
    // Proteção contra dados vazios
    if (!codeData) {
         return { error: "Erro ao ler dados do código." };
    }

    console.log("[AUTH] Dados do código:", codeData);

    // Validação de Uso
    if (codeData.uses !== undefined && codeData.uses <= 0) {
       return { error: "Este código já foi totalmente utilizado." };
    }

    // CRIAÇÃO DO USUÁRIO (Firebase Auth)
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = userCredential.user.uid;
    console.log("[AUTH] Usuário criado no Auth:", uid);

    // CRIAÇÃO DO DOCUMENTO DO USUÁRIO
    const userDocRef = doc(db, "users", uid);
    const newUserData: UserData = {
      email: email,
      tipo_plano: codeData.plan || (codeData.plano_liberado) || 'basic',
      streak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      hasSeenTutorial: false,
      hasChristmasAddon: codeData.type === 'addon' || codeData.value === 'christmas',
      requiresNewPassword: false,
      createdAt: serverTimestamp()
    };

    await setDoc(userDocRef, newUserData);
    console.log("[AUTH] Documento do usuário criado.");

    // DECREMENTAR USO DO CÓDIGO
    if (codeData.uses !== undefined) {
      if (codeData.uses <= 1) {
        await deleteDoc(codeRef); // Uso único: deleta
        console.log("[AUTH] Código de uso único deletado.");
      } else {
        await setDoc(codeRef, { uses: codeData.uses - 1 }, { merge: true });
        console.log(`[AUTH] Usos restantes: ${codeData.uses - 1}`);
      }
    } else {
      // Se não tiver campo 'uses', deleta por segurança
      await deleteDoc(codeRef);
    }

    return { user: userCredential.user };

  } catch (error: any) {
    console.error("Erro Crítico no Registro:", error);
    let msg = "Falha no registro.";
    if (error.code === 'auth/email-already-in-use') msg = "E-mail já está em uso.";
    if (error.code === 'auth/weak-password') msg = "Senha muito fraca (mín 6 chars).";
    if (error.code === 'permission-denied') msg = "Erro de permissão no banco de dados.";
    return { error: msg };
  }
};

// --- ADMIN / GERAÇÃO DE CÓDIGOS ---

export const createAccessCode = async (code: string, type: 'plan' | 'addon', value: string, uses: number) => {
  try {
    const cleanCode = code.toUpperCase().trim();
    // Salva ID e campo 'codigo'
    await setDoc(doc(db, "codigos_acesso", cleanCode), {
      codigo: cleanCode,
      type,
      plan: value, 
      uses,
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao criar código:", error);
    throw error;
  }
};

// --- DATABASE LISTENERS & UPDATES ---

export const subscribeToUserData = (uid: string, callback: (data: any) => void) => {
  const userRef = doc(db, "users", uid);
  return onSnapshot(userRef, 
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error("[FIRESTORE] Erro no listener:", error);
      if (error.code === 'permission-denied') {
        console.warn("Permissão negada. Verifique as regras do Firestore.");
      }
    }
  );
};

export const completeTutorial = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { hasSeenTutorial: true }, { merge: true });
  } catch (error) {
    console.error("Erro tutorial:", error);
  }
};

// --- RESGATE DE CÓDIGO (PÓS-LOGIN) ---

export const redeemCode = async (uid: string, codeInput: string) => {
  const code = codeInput.toUpperCase().trim();
  console.log(`[REDEEM] Tentando resgatar código: ${code} para user ${uid}`);

  try {
    const docRef = doc(db, "codigos_acesso", code);
    const docSnap = await getDoc(docRef);

    let finalDocSnap = docSnap;
    let finalDocRef = docRef;

    // Fallback para Query se não achar por ID
    if (!docSnap.exists()) {
       const q = query(collection(db, "codigos_acesso"), where("codigo", "==", code));
       const querySnap = await getDocs(q);
       if (!querySnap.empty) {
         finalDocSnap = querySnap.docs[0];
         finalDocRef = finalDocSnap.ref;
       } else {
         return { success: false, message: "Código inválido." };
       }
    }

    const data = finalDocSnap.data();
    
    // Proteção crucial para evitar crash do build
    if (!data) {
        return { success: false, message: "Erro ao ler código." };
    }

    const userRef = doc(db, "users", uid);

    // Aplica benefício
    if (data.type === 'plan') {
      await setDoc(userRef, { tipo_plano: data.plan }, { merge: true });
    } else {
      await setDoc(userRef, { hasChristmasAddon: true }, { merge: true });
    }

    // Queima o código
    await deleteDoc(finalDocRef);

    return { success: true, message: "Sucesso! Benefício liberado." };
  } catch (e: any) {
    console.error("Erro Redeem:", e);
    return { success: false, message: "Erro ao processar código." };
  }
};

// --- PAGAMENTO PIX (MOCK) ---
// Adicionado "_" para evitar erro de variável não usada no build
export const generatePixPayment = async (_amount: string, _description: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    success: true,
    copyPasteCode: "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Reta Final App6008Brasilia62070503***6304E2CA",
  };
};