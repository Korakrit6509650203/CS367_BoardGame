package com.webapp.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/games")
@CrossOrigin(origins = "*")
public class BoardgameController {

    @Autowired
    private BoardgameService boardgameService;
    
    public BoardgameController(BoardgameService boardgameService) {
        this.boardgameService = boardgameService;
    }

    // GET: List all board games
    @GetMapping
    public List<Boardgame> listAllBoardGames() {
        return boardgameService.getAllBoardGames();
    }

    // GET: Get a board game by ID
    @GetMapping("/{id}")
    public ResponseEntity<Boardgame> listByIdBoardGames(@PathVariable Long id) {
        Optional<Boardgame> boardgame = boardgameService.getByIdBoardGame(id);
        return boardgame.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // POST: Create a new board game
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Boardgame createBoardGame(@RequestBody Boardgame boardgame) {
        return boardgameService.createBoardGame(boardgame);
    }

    // PUT: Update an existing board game
    @PutMapping("/{id}")
    public ResponseEntity<Boardgame> updateBoardGame(@PathVariable Long id, @RequestBody Boardgame boardgame) {
        Optional<Boardgame> existingGame = boardgameService.getByIdBoardGame(id);
        if (existingGame.isPresent()) {
            Boardgame updatedGame = existingGame.get();
            updatedGame.setGameName(boardgame.getGameName());
            updatedGame.setTypes(boardgame.getTypes());
            updatedGame.setNumberOfPlayers(boardgame.getNumberOfPlayers());
            updatedGame.setAgeOfPlayers(boardgame.getAgeOfPlayers());
            updatedGame.setDifficultyLevel(boardgame.getDifficultyLevel());
            updatedGame.setPlayingTime(boardgame.getPlayingTime());
            // updatedGame.setAvailability(boardgame.isAvailability());
            updatedGame.setDiscountDeposit(boardgame.getDiscountDeposit());
            updatedGame.setPromotions(boardgame.getPromotions());
            updatedGame.setPicture(boardgame.getPicture());
            updatedGame.setStock(boardgame.getStock());
            return ResponseEntity.ok(boardgameService.createBoardGame(updatedGame));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // DELETE: Delete a board game by ID
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBoardGameById(@PathVariable Long id) {
        boardgameService.deleteBoardGame(id);
    }

    // PATCH: Reduce stock for a board game
    @PatchMapping("/reduce-stock/{gameName}")
    public ResponseEntity<?> reduceStock(@PathVariable String gameName) {
        Optional<Boardgame> boardgame = boardgameService.findByNameBoardGame(gameName);
        if (boardgame.isPresent()) {
            Boardgame game = boardgame.get();
            if (game.getStock() > 0) {
                game.setStock(game.getStock() - 1);
                boardgameService.createBoardGame(game);
                return ResponseEntity.ok("Stock reduced successfully for game: " + gameName);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Stock is already at zero.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game not found: " + gameName);
        }
    }

    // PATCH: Increase stock for a board game
    @PatchMapping("/increase-stock/{gameName}")
    public ResponseEntity<?> increaseStock(@PathVariable String gameName) {
        Optional<Boardgame> boardgame = boardgameService.findByNameBoardGame(gameName);
        if (boardgame.isPresent()) {
            Boardgame game = boardgame.get();
            game.setStock(game.getStock() + 1); // เพิ่มสต๊อก
            boardgameService.createBoardGame(game); // บันทึกการเปลี่ยนแปลง
            return ResponseEntity.ok("Stock increased successfully for game: " + gameName);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game not found: " + gameName);
        }
    }
}


