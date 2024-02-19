import { useState, useReducer, useEffect } from "react";
import "./App.css";

// components imports
import ExpenseForm from "./components/ExpenseForm/ExpenseForm";
import ExpenseInfo from "./components/ExpenseInfo/ExpenseInfo";
import ExpenseList from "./components/ExpenseList/ExpenseList";

// react toasts
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import firebase methods here
import { doc, collection, addDoc, setDoc, getDocs, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseInit";

const reducer = (state, action) => {
  const { payload } = action;
  switch (action.type) {
    // add cases to set retrived expenses to state here
    case "SET_EXPENSES": {
      return {
        expenses: payload.expenses
      };
    }
    case "ADD_EXPENSE": {
      return {
        expenses: [payload.expense, ...state.expenses]
      };
    }
    case "REMOVE_EXPENSE": {
      return {
        expenses: state.expenses.filter((expense) => expense.id !== payload.id)
      };
    }
    case "UPDATE_EXPENSE": {
      const expensesDuplicate = state.expenses;
      expensesDuplicate[payload.expensePos] = payload.expense;
      return {
        expenses: expensesDuplicate
      };
    }
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, { expenses: [] });
  const [expenseToUpdate, setExpenseToUpdate] = useState(null);

  // create function to get expenses from firestore here
  // use appropriate hook to get the expenses when app mounts

  //With onSnapshot for realtime update

  useEffect(() => {
    const expenseData = onSnapshot(collection(db, "expenses"), (snapShot) => {
      const expenses = snapShot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })
      dispatch({ type: "SET_EXPENSES", payload: { expenses } });
      toast.success("Expenses retrived successfully.");
    })
  }, []);

  //With case 1 SET_EXPENSES
  // useEffect(() => {
  //   const fetchExpenses = async () => {

  //     const querySnapshot = await getDocs(collection(db, "expenses"));
  //     const expenses = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data()
  //     }));
  //     dispatch({ type: "SET_EXPENSES", payload: { expenses } });
  //     toast.success("Expenses retrived successfully.");
  //   }

  //   fetchExpenses();
  // }, []);

  // without case 1 SET_EXPENSES
  // useEffect(() => {
  //   const fetchExpenses = async () => {
  //       const querySnapshot = await getDocs(collection(db, "expenses"));
  //       const expensesData = querySnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data()
  //       }));
  //       expensesData.forEach((expense) => {
  //         dispatch({ type: "ADD_EXPENSE", payload: { expense } });
  //       });
  //     }

  //   fetchExpenses();
  // }, []);


  const addExpense = async (expense) => {
    const expenseRef = collection(db, "expenses");
    const docRef = await addDoc(expenseRef, expense);

    dispatch({
      type: "ADD_EXPENSE",
      payload: { expense: { id: docRef.id, ...expense } }
    });
    toast.success("Expense added successfully.");
  };

  const deleteExpense = async (id) => {
    // delete expense from firestore here
    await deleteDoc(doc(db, "expenses", id))
    dispatch({ type: "REMOVE_EXPENSE", payload: { id } });
    toast.success("Expense deleted successfully.");
  };

  const resetExpenseToUpdate = () => {
    setExpenseToUpdate(null);
  };

  const updateExpense = async (expense) => {
    const expensePos = state.expenses
      .map(function (exp) {
        return exp.id;
      })
      .indexOf(expense.id);

    if (expensePos === -1) {
      return false;
    }

    const { id, ...updatedFields } = expense; // Destructure expense to get updated fields
    const expenseRef = doc(db, "expenses", id);
    await updateDoc(expenseRef, updatedFields);

    dispatch({ type: "UPDATE_EXPENSE", payload: { expensePos, expense } });
    toast.success("Expense updated successfully.");
  };

  return (
    <>
      <ToastContainer />
      <h2 className="mainHeading">Expense Tracker</h2>
      <div className="App">
        <ExpenseForm
          addExpense={addExpense}
          expenseToUpdate={expenseToUpdate}
          updateExpense={updateExpense}
          resetExpenseToUpdate={resetExpenseToUpdate}
        />
        <div className="expenseContainer">
          <ExpenseInfo expenses={state.expenses} />
          <ExpenseList
            expenses={state.expenses}
            deleteExpense={deleteExpense}
            changeExpenseToUpdate={setExpenseToUpdate}
          />
        </div>
      </div>
    </>
  );
}

export default App;
