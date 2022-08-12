// import logo from './logo.svg';
import "./App.css";
import { useEffect, useReducer } from "react";
import { nanoid } from "nanoid";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_TODOS = gql`
  query todos {
    todos {
      id
      text
      status
      update_ctr
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($text: String!) {
    addTodo(text: $text) {
      id
      text
      status
      update_ctr
    }
  }
`;

const Header = (props) => {
  return (
    <header className="header">
      <h1>{props.title ?? "Default"}</h1>
    </header>
  );
};

const FILTER_ITEMS = {
  ALL: { title: "All" },
  ACTIVE: { title: "Active" },
  COMPLETED: { title: "Completed" },
};

const Filter = (props) => {
  const { titleForAll, titleForActive, titleForCompleted, selected } = props;

 

  return (
    <ul className="filters">
      <li>
        <a
          className={selected === "" ? "selected" : ""}
          href="#/"
          onClick={() => onchange("")}
        >
          {titleForAll ?? FILTER_ITEMS["ALL"].title}
        </a>
      </li>
      <li>
        <a
          className={selected === "ACTIVE" ? "selected" : ""}
          href="#/"
          onClick={() => onchange("ACTIVE")}
        >
          {titleForActive ?? FILTER_ITEMS["ACTIVE"].title}
        </a>
      </li>
      <li>
        <a
          className={selected === "COMPLETED" ? "selected" : ""}
          href="#/completed"
          onClick={() => onchange("COMPLETED")}
        >
          {titleForCompleted ?? FILTER_ITEMS["COMPLETED"].title}
        </a>
      </li>
    </ul>
  );
};

const initialData = {
  title: "todos",
  newTodoText: "",
  todos: [
    // {
    //   status: "COMPLETED",
    //   text: "Learn React",
    // },
    // {
    //   status: "ACTIVE",
    //   text: "Learn Javascript",
    // },
  ],

  titleForAll: "All",
  titleForActive: "Active",
  titleForCompleted: "Completed",
  selectedFilter: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "setNewTodoText": {
      return { ...state, newTodoText: action.payload };
    }

    case "addTodo": {
      let _todos = [...state.todos];
      //let _filterObject = [...state.filterTodos];
      //get the typing text (action->payload->text)
      let _text = action.payload.text;
      const newTodo = { text: _text, status: "ACTIVE", id: nanoid() };
      _todos.splice(_todos.length, 0, newTodo);

      return { ...state, todos: _todos, newTodoText: "" };
    }

    case "deleteTodo": {
      let _todos = [...state.todos];
      const _id = action.payload.id;
      const _index = _todos.findIndex((item) => item.id === _id);

      _todos.splice(_index, 1);
      return { ...state, todos: _todos };
    }

    case "completeTodo": {
      let _todos = [...state.todos];
      const _id = action.payload.id;
      const _index = _todos.findIndex((item) => item.id === _id);
      const _todo = { ..._todos[_index], status: "COMPLETED" };

      _todos.splice(_index, 1, _todo);
      return { ...state, todos: _todos };
    }

    case "changeTodo": {
      //index, text
      let _todos = [...state.todos];
      const _id = action.payload.id;
      const _index = _todos.findIndex((item) => item.id === _id);
      const _text = action.payload.text;
      const _todo = { ..._todos[_index], text: _text };

      _todos.splice(_index, 1, _todo);
      return { ...state, todos: _todos };
    }

    case "clearComplete": { 
      let _todos = [...state.todos].filter(
        (item) => item.status !== "COMPLETED"
      );
      return { ...state, todos: _todos };
    }

    case "setSelectedFilter": {
      return { ...state, selectedFilter: action.payload };
    }

    case "setData": {
      let _todos = [...action.payload];
      return { ...state, todos: _todos };
    }

    default:
      throw new Error();
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialData);
  const { data, refetch } = useQuery(GET_TODOS);
  const [addTodo] = useMutation(ADD_TODO);

  const onChangeNewTodoText = (evt) => {
    dispatch({ type: "setNewTodoText", payload: evt.target.value });
  };

  const onAddTodo = (evt) => {
    if (evt.keyCode === 13 && state.newTodoText.trim().length > 0) {
      console.log("Enter key pressed:", state.newTodoText);
      //dispatch({type: "addTodo",payload: { newTodoText: state.newTodoText.trim() },});
      addTodo({ variables: { text: state.newTodoText.trim() } });
      dispatch({ type: "setNewTodoText", payload: "" });
      refetch();
    }
  };
  const onComplete = (id) => {
    dispatch({ type: "completeTodo", payload: { id } });
  };

  const onDelete = (id) => {
    dispatch({ type: "deleteTodo", payload: { id } });
  };

  const onChangeText = (id, text) => {
    dispatch({ type: "changeTodo", payload: { id, text } });
  };
  const onClearComplete = () => {
    dispatch({ type: "clearComplete" });
  };

  const onSetSelectedFilter = (val) => {
    dispatch({
      type: "setSelectedFilter",
      payload: val,
    });
  };

  useEffect(() => {
    console.log("data:", data);
    dispatch({
      type: "setData",
      payload: data && data.todos ? data.todos : [],
    });
  }, [data]); 

  
  

  return (
    <>
      <section className="todoapp">
        <Header title={state.title} />
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={state.newTodoText}
          onChange={onChangeNewTodoText}
          onKeyDown={onAddTodo}
        />
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {state.todos.map((itm, index) => {
              if (
                state.selectedFilter === "" ||
                state.selectedFilter === itm.status
              ) {
                return (
                  <li
                    key={itm.id}
                    className={itm.status === "COMPLETED" ? "completed" : ""}
                  >
                    <div className="view">
                      <input
                        className="toggle1"
                        type="checkbox"
                        checked={itm.status === "COMPLETED" ? true : false}
                        onChange={() => {
                          onComplete(itm.id);
                        }}
                      />
                      {itm.status === "COMPLETED" ? (
                        <label>{itm.text}</label>
                      ) : (
                        <input
                          className="edit"
                          value={itm.text}
                          onChange={(evt) => {
                            console.log(evt.target.value);
                            onChangeText(itm.id, evt.target.value);
                          }}
                        />
                      )}
                      <button
                        className="destroy"
                        onClick={() => {
                          onDelete(itm.id);
                        }}
                      ></button>
                    </div>
                  </li>
                );
              } else {
                return null;
              }
            })}
          </ul>
        </section>
        <footer className="footer">
          <span className="todo-count">
            <strong>{state.todos.length}</strong> item
            {state.todos.length > 1 ? "s" : ""} left
          </span>

          <Filter
            titleForAll={state.titleForAll}
            titleForActive={state.titleForActive}
            titleForCompleted={state.titleForCompleted}
            selected={state.selectedFilter}
            onChange={onSetSelectedFilter}
          />
          <button
            className="clear-completed"
            onClick={ onClearComplete }
          >
            Clear completed
          </button>
        </footer>
      </section>
    </>
  );
}

export default App;
