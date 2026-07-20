import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import type { Todo } from '../../models/Todo';

interface TodoState {
    todos: Todo[];
    selectedTodo: Todo | null;
    loading: boolean;
    error: string | null;
}

const initialState: TodoState = {
    todos: [],
    selectedTodo: null,
    loading: false,
    error: null,
};


// =========================
// GET TODOS
// =========================

export const fetchTodos = createAsyncThunk(
    'todos/fetchAll',
    async (_, { rejectWithValue }) => {
        try {

            const response = await api.get<Todo[]>('/todos');

            return response.data;

        } catch (error: any) {

            return rejectWithValue(
                error.response?.data?.error ?? error.message
            );

        }
    }
);


// =========================
// GET TODO BY ID
// =========================

export const fetchTodoById = createAsyncThunk(
    'todos/fetchById',
    async (id: number, { rejectWithValue }) => {

        try {

            const response = await api.get<Todo>(
                `/todos/${id}`
            );

            return response.data;

        } catch (error: any) {

            return rejectWithValue(
                error.response?.data?.error ?? error.message
            );

        }

    }
);


// =========================
// GET TODOS BY USER ID
// equivalente a fetchCommentsByPostId
// =========================

export const fetchTodosByUserId = createAsyncThunk(
    'todos/fetchByUserId',
    async (userId: number, { rejectWithValue }) => {

        try {

            const response = await api.get<Todo[]>('/todos');


            return response.data.filter(
                todo => Number(todo.userId) === Number(userId)
            );


        } catch (error: any) {

            return rejectWithValue(
                error.response?.data?.error ?? error.message
            );

        }

    }
);


// =========================
// CREATE
// =========================

export const createTodo = createAsyncThunk(
    'todos/create',
    async (todo: Omit<Todo,'id'>, { rejectWithValue }) => {

        try {

            const response = await api.post<Todo>(
                '/todos',
                todo
            );

            return response.data;

        } catch(error:any){

            return rejectWithValue(
                error.response?.data?.error ?? error.message
            );

        }

    }
);


// =========================
// UPDATE
// =========================

export const updateTodo = createAsyncThunk(
    'todos/update',
    async (
        {id,todo}:{
            id:number;
            todo:Omit<Todo,'id'>
        },
        {rejectWithValue}
    )=>{

        try{

            await api.put(
                `/todos/${id}`,
                todo
            );


            return {
                id,
                ...todo
            } as Todo;


        }catch(error:any){

            return rejectWithValue(
                error.response?.data?.error ?? error.message
            );

        }

    }
);


// =========================
// DELETE
// =========================

export const deleteTodo = createAsyncThunk(
    'todos/delete',
    async(id:number,{rejectWithValue})=>{

        try{

            await api.delete(
                `/todos/${id}`
            );

            return id;


        }catch(error:any){

            return rejectWithValue(
                error.response?.data?.error ?? error.message
            );

        }

    }
);



const todoSlice = createSlice({

    name:'todos',

    initialState,

    reducers:{

        clearSelectedTodo:(state)=>{

            state.selectedTodo=null;

        },


        clearError:(state)=>{

            state.error=null;

        }

    },


    extraReducers:(builder)=>{

        builder


            // FETCH ALL
            .addCase(fetchTodos.pending,(state)=>{

                state.loading=true;
                state.error=null;

            })

            .addCase(fetchTodos.fulfilled,
                (state,action:PayloadAction<Todo[]>)=>{

                    state.loading=false;
                    state.todos=action.payload;

                }
            )

            .addCase(fetchTodos.rejected,(state,action)=>{

                state.loading=false;
                state.error=action.payload as string;

            })



            // FETCH BY USER
            .addCase(fetchTodosByUserId.pending,(state)=>{

                state.loading=true;
                state.error=null;

            })

            .addCase(fetchTodosByUserId.fulfilled,
                (state,action:PayloadAction<Todo[]>)=>{

                    state.loading=false;
                    state.todos=action.payload;

                }
            )

            .addCase(fetchTodosByUserId.rejected,(state,action)=>{

                state.loading=false;
                state.error=action.payload as string;

            })



            // FETCH BY ID
            .addCase(fetchTodoById.fulfilled,
                (state,action:PayloadAction<Todo>)=>{

                    state.loading=false;
                    state.selectedTodo=action.payload;

                }
            )



            // CREATE
            .addCase(createTodo.fulfilled,
                (state,action:PayloadAction<Todo>)=>{

                    state.loading=false;
                    state.todos.push(action.payload);

                }
            )



            // UPDATE
            .addCase(updateTodo.fulfilled,
                (state,action:PayloadAction<Todo>)=>{

                    state.loading=false;

                    const index =
                        state.todos.findIndex(
                            t=>t.id===action.payload.id
                        );


                    if(index!==-1){

                        state.todos[index]=action.payload;

                    }

                    state.selectedTodo=action.payload;

                }
            )



            // DELETE
            .addCase(deleteTodo.fulfilled,
                (state,action:PayloadAction<number>)=>{

                    state.loading=false;

                    state.todos =
                        state.todos.filter(
                            t=>t.id!==action.payload
                        );


                    if(state.selectedTodo?.id===action.payload){

                        state.selectedTodo=null;

                    }

                }
            );

    }

});


export const {
    clearSelectedTodo,
    clearError
}=todoSlice.actions;


export default todoSlice.reducer;