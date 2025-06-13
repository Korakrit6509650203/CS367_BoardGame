package com.webapp.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BoardgameService {

    @Autowired
    private final BoardgameRepository boardgameRepository;

    public BoardgameService(BoardgameRepository boardgameRepository) {
        this.boardgameRepository = boardgameRepository;
    }

    // ดึงข้อมูลเกมทั้งหมด
    public List<Boardgame> getAllBoardGames() {
        return boardgameRepository.findAll();
    }

    // สร้างเกมใหม่
    public Boardgame createBoardGame(Boardgame boardgame) {
        return boardgameRepository.save(boardgame);
    }

    // อัปเดตข้อมูลเกม
    public Boardgame updateBoardGame(Long id, Boardgame boardgame) {
        Boardgame existingGame = boardgameRepository.findById(id).orElseThrow(() -> new RuntimeException("Game not found"));
        
        // อัปเดตเฉพาะฟิลด์ที่มีค่าไม่เป็น null หรือมีการส่งข้อมูลมา
        if (boardgame.getGameName() != null) {
            existingGame.setGameName(boardgame.getGameName());
        }
        if (boardgame.getTypes() != null) {
            existingGame.setTypes(boardgame.getTypes());
        }
        if (boardgame.getNumberOfPlayers() != null) {  // สมมติว่าค่า 0 หมายถึงไม่ได้เปลี่ยนแปลง
            existingGame.setNumberOfPlayers(boardgame.getNumberOfPlayers());
        }
        if (boardgame.getAgeOfPlayers() != null) {
            existingGame.setAgeOfPlayers(boardgame.getAgeOfPlayers());
        }
        if (boardgame.getDifficultyLevel() != null) {
            existingGame.setDifficultyLevel(boardgame.getDifficultyLevel());
        }
        if (boardgame.getPlayingTime() != null) {
            existingGame.setPlayingTime(boardgame.getPlayingTime());
        }
        if (boardgame.getDiscountDeposit() != null) {
            existingGame.setDiscountDeposit(boardgame.getDiscountDeposit());
        }
        if (boardgame.getPromotions() != null) {
            existingGame.setPromotions(boardgame.getPromotions());
        }
        // if (boardgame.getPicture() != null) {
        //     existingGame.setPicture(boardgame.getPicture());
        // }
        if (boardgame.getStock() != 0 && boardgame.getStock() >= 0) {  // สมมติว่าค่า 0 หมายถึงไม่ได้เปลี่ยนแปลง
            existingGame.setStock(boardgame.getStock());
        }
        // if (boardgame.getStock().isAvailability() != existingGame.isAvailability()) {
        //     existingGame.setAvailability(boardgame.getStock().isAvailability());
        // }

        return boardgameRepository.save(existingGame);
    }

    // ลบข้อมูลเกม
    public void deleteBoardGame(Long gameId) {
        boardgameRepository.deleteById(gameId);
    }

    // ค้นหาข้อมูลเกมด้วยไอดี
    public Optional<Boardgame> getByIdBoardGame(Long id) {
        return boardgameRepository.findById(id);
    }

    // ค้นหาข้อมูลเกมด้วยชื่อเกม
    public Optional<Boardgame> findByNameBoardGame(String gameName) {
        return boardgameRepository.findByGameName(gameName);
    }

    // ลดจำนวนของเกม
    public void reduceStockBoardGame(String gameName) {
        Optional<Boardgame> optionalGame = boardgameRepository.findByGameName(gameName);
        if (optionalGame.isPresent()) {
            Boardgame game = optionalGame.get();
            if (game.getStock() > 0) {
                game.setStock(game.getStock() - 1);
                boardgameRepository.save(game);
            } else {
                throw new IllegalStateException("Out of stock for game: " + gameName);
            }
        } else {
            throw new IllegalArgumentException("Game not found: " + gameName);
        }
    }
}
