package com.PoommySang.boardgame_rental.Repository;

import com.PoommySang.boardgame_rental.Entity.BoardGame;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardGameRepository extends JpaRepository<BoardGame, Long> {
    // ใช้ JpaRepository ในการจัดการข้อมูลเกมในฐานข้อมูล
    Optional<BoardGame> findByGameName(String gameName);
    void deleteByGameName(String gameName); 
}
