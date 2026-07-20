package org.web.services;

import org.web.db.Photo;
import org.web.respositories.AlbumRepository;
import org.web.respositories.PhotoRepository;
import org.web.respositories.UserRepository;
import org.web.utils.ExceptionHandler;

import java.util.List;
import java.util.Optional;

public class PhotoService {

    private final PhotoRepository photoRepository;
    private final AlbumRepository albumRepository;

    public PhotoService(PhotoRepository photoRepository, AlbumRepository albumRepository) {
        this.photoRepository = photoRepository;
        this.albumRepository = albumRepository;
    }

    public List<Photo> findAll(){
        return photoRepository.findAll();
    }

    public Optional<Photo> findById(Integer id){
        return photoRepository.findById(id);
    }

    public Photo create(Photo photo){
        if(photo.albumId()==null|| photoRepository.findById(photo.albumId()).isEmpty()){
            throw new ExceptionHandler("Album Not Found");
        }
        return photoRepository.create(photo);
    }

    public boolean update(Integer id,Photo photo){
        if(photoRepository.findById(id).isEmpty()){
            return false;
        }
        if(photo.albumId()==null||albumRepository.findById(photo.albumId()).isEmpty()){
            throw new ExceptionHandler("Album Not Found");
        }
        return photoRepository.update(id, photo)>0;
    }

    public boolean delete(Integer id){
        return photoRepository.delete(id)>0;
    }

}
