import { createStore } from 'redux';

const initialState = {
  currentForm: { fields: [] },
  savedForms: JSON.parse(localStorage.getItem('savedForms')) || []
};

function formReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_FIELD':
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          fields: [...state.currentForm.fields, action.payload]
        }
      };
      
    case 'UPDATE_FIELD':
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          fields: state.currentForm.fields.map(field => 
            field.id === action.payload.id ? {...field, ...action.payload.updates} : field
          )
        }
      };
      
    case 'DELETE_FIELD':
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          fields: state.currentForm.fields.filter(field => field.id !== action.payload)
        }
      };
      
    case 'REORDER_FIELDS':
      const newFields = [...state.currentForm.fields];
      const [moved] = newFields.splice(action.payload.sourceIndex, 1);
      newFields.splice(action.payload.destinationIndex, 0, moved);
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          fields: newFields
        }
      };
      
    case 'SAVE_FORM':
      const newForm = {
        id: Date.now().toString(),
        name: action.payload.name,
        fields: [...state.currentForm.fields],
        createdAt: new Date().toISOString()
      };
      const updatedForms = [...state.savedForms, newForm];
      localStorage.setItem('savedForms', JSON.stringify(updatedForms));
      return {
        ...state,
        savedForms: updatedForms,
        currentForm: { fields: [] }
      };
      
    case 'LOAD_FORM':
      return {
        ...state,
        currentForm: {
          fields: action.payload.fields
        }
      };
      
    default:
      return state;
  }
}

export default createStore(formReducer);