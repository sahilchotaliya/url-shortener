package com.url.shortener.repository;

import com.url.shortener.models.UrlMapping;
import com.url.shortener.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {
   UrlMapping findByShortUrl(String shortUrl);
   List<UrlMapping> findByUser(User user);
   
   /**
    * Checks if a URL with the given ID belongs to a specific user
    * 
    * @param id The URL ID
    * @param userId The user ID
    * @return true if the URL belongs to the user, false otherwise
    */
   @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM UrlMapping u WHERE u.id = :id AND u.user.id = :userId")
   boolean existsByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}
