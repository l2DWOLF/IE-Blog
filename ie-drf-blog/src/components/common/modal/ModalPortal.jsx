import './css/modal.css'
import { createPortal } from 'react-dom';


const modalRoot = document.getElementById('modal-root');

function ModalPortal({ children}){
    if (!modalRoot) return null;
    return createPortal(children, modalRoot);
};

export default ModalPortal;