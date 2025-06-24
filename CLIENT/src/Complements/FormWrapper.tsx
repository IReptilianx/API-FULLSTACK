import Form from './Form';
import { useActivityStore } from '../store';

const FormWrapper = () => {
  const { state, dispatch, isLoading } = useActivityStore();
  
  if (isLoading) {
    return <div className="loading">Cargando datos...</div>;
  }
  
  return (
    <div className="main-content">
      <Form dispatch={dispatch} state={state} />
    </div>
  );
};

export default FormWrapper;
