package org.web.services;

import org.web.db.Todo;
import org.web.respositories.TodoRepository;
import org.web.respositories.UserRepository;
import org.web.utils.ExceptionHandler;

import java.util.List;
import java.util.Optional;

public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public TodoService(TodoRepository todoRepository,UserRepository userRepository) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

    public List<Todo> findAll(){
        return todoRepository.findAll();
    }

    public Optional<Todo> findById(Integer id){
        return todoRepository.findById(id);
    }

    public Todo create(Todo todo){
        if(todo.userId()==null || userRepository.findById(todo.userId()).isEmpty()){
            throw new ExceptionHandler("User not found");
        }
        return todoRepository.create(todo);
    }

    public boolean update(Integer id, Todo todo){
        if(todoRepository.findById(id).isEmpty()){
            return false;
        }
        if(todo.userId()==null||userRepository.findById(todo.userId()).isEmpty()){
            throw new ExceptionHandler("User not found");
        }

        return todoRepository.update(id, todo)>0;
    }

    public boolean delete(Integer id){
        return todoRepository.deleteById(id)>0;
    }

}
