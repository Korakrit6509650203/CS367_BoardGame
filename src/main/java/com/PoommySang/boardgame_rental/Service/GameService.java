package com.PoommySang.boardgame_rental.Service;

import com.PoommySang.boardgame_rental.Entity.BoardGame;
import com.PoommySang.boardgame_rental.Repository.BoardGameRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameService {

    private final BoardGameRepository gameRepository;

    public GameService(BoardGameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    // ดึงข้อมูลเกมทั้งหมด
    public List<BoardGame> getAllGames() {
        return gameRepository.findAll();
    }

    // สร้างเกมใหม่
    public BoardGame createGame(BoardGame boardGame) {
        return gameRepository.save(boardGame);
    }

    // อัปเดตข้อมูลเกม
    public BoardGame updateGame(Long id, BoardGame boardGame) {
        BoardGame existingGame = gameRepository.findById(id).orElseThrow(() -> new RuntimeException("Game not found"));
        
        // อัปเดตเฉพาะฟิลด์ที่มีค่าไม่เป็น null หรือมีการส่งข้อมูลมา
        if (boardGame.getGameName() != null) {
            existingGame.setGameName(boardGame.getGameName());
        }
        if (boardGame.getTypes() != null) {
            existingGame.setTypes(boardGame.getTypes());
        }
        if (boardGame.getNumberOfPlayers() != null) {  // สมมติว่าค่า 0 หมายถึงไม่ได้เปลี่ยนแปลง
            existingGame.setNumberOfPlayers(boardGame.getNumberOfPlayers());
        }
        if (boardGame.getAgeOfPlayers() != null) {
            existingGame.setAgeOfPlayers(boardGame.getAgeOfPlayers());
        }
        if (boardGame.getDifficultyLevel() != null) {
            existingGame.setDifficultyLevel(boardGame.getDifficultyLevel());
        }
        if (boardGame.getPlayingTime() != null) {
            existingGame.setPlayingTime(boardGame.getPlayingTime());
        }
        if (boardGame.getDiscountDeposit() != null) {
            existingGame.setDiscountDeposit(boardGame.getDiscountDeposit());
        }
        if (boardGame.getPromotions() != null) {
            existingGame.setPromotions(boardGame.getPromotions());
        }
        if (boardGame.getPicture() != null) {
            existingGame.setPicture(boardGame.getPicture());
        }
        if (boardGame.getStock() != 0) {  // สมมติว่าค่า 0 หมายถึงไม่ได้เปลี่ยนแปลง
            existingGame.setStock(boardGame.getStock());
        }
        if (boardGame.isAvailability() != existingGame.isAvailability()) {
            existingGame.setAvailability(boardGame.isAvailability());
        }

        // บันทึกการเปลี่ยนแปลง
        return gameRepository.save(existingGame);
    }

    // ลบข้อมูลเกม
    public void deleteGame(String gameName) {
        gameRepository.deleteByGameName(gameName);
    }

    public Optional<BoardGame> getByIdGames(Long id) {
        return gameRepository.findById(id);
    }

    public Optional<BoardGame> findByGameName(String gameName) {
        return gameRepository.findByGameName(gameName);
    }

    public void reduceStock(String gameName) {
        Optional<BoardGame> optionalGame = gameRepository.findByGameName(gameName);
        if (optionalGame.isPresent()) {
            BoardGame game = optionalGame.get();
            if (game.getStock() > 0) {
                game.setStock(game.getStock() - 1);
                gameRepository.save(game); // บันทึกการเปลี่ยนแปลง
            } else {
                throw new IllegalStateException("Out of stock for game: " + gameName);
            }
        } else {
            throw new IllegalArgumentException("Game not found: " + gameName);
        }
    }
    
}
