package org.web.services;

import org.web.db.User;
import org.web.respositories.UserRepository;
import org.web.utils.ExceptionHandler;

import java.util.List;
import java.util.Optional;

public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
       this.userRepository =userRepository;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    public User create(User user) {
        return  userRepository.create(user);
    }

    public boolean update(Integer id, User user) {
        return userRepository.update(id, user) > 0;
    }

    public boolean delete(Integer id) {
        return userRepository.deleteById(id) > 0;
    }

}
