import { useReducer } from 'react';
import Form from './Form';
import { activityReducer, initialState } from '../reducers/activity-reducers';

const FormWrapper = () => {
  const [state, dispatch] = useReducer(activityReducer, initialState);
  return (
    <div className="main-content">
      <Form dispatch={dispatch} state={state} />
    </div>
  );
};

export default FormWrapper;
