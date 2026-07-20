package org.web.services;

import org.web.db.Album;
import org.web.respositories.AlbumRepository;
import org.web.respositories.UserRepository;
import org.web.utils.ExceptionHandler;

import java.util.List;
import java.util.Optional;

public class AlbumService {

    private final AlbumRepository albumRepository;
    private final UserRepository userRepository;

    public AlbumService(AlbumRepository albumRepository, UserRepository userRepository) {
        this.albumRepository = albumRepository;
        this.userRepository =  userRepository;
    }


    public List<Album> findAll() {
        return albumRepository.findAll();
    }

    public Optional<Album> findById(Integer id) {
        return albumRepository.findById(id);
    }

    public Album create(Album album) {
        if(album.userId()==null || userRepository.findById(album.userId()).isEmpty()) {
            throw new ExceptionHandler("User not found");
        }
        return albumRepository.create(album);
    }

    public boolean update(Integer id,Album album) {
        if(albumRepository.findById(id).isEmpty()) {
            return false;
        }
        if(album.userId()==null || userRepository.findById(album.userId()).isEmpty()) {
            throw new ExceptionHandler("User not found");
        }

        return albumRepository.update(id,album)>0;
    }

    public boolean delete(Integer id) {
        return albumRepository.deleteById(id) > 0;
    }


}
