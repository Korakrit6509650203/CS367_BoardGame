package com.PoommySang.boardgame_rental.Controller;

import com.PoommySang.boardgame_rental.Entity.BoardGame;
import com.PoommySang.boardgame_rental.Service.GameService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/games")
@CrossOrigin(origins = "*") // สำคัญมาก!
public class BoardGameController {

    private final GameService boardGameService;

    public BoardGameController(GameService boardGameService) {
        this.boardGameService = boardGameService;
    }

    // POST: Create a new board game
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BoardGame createBoardGame(@RequestBody BoardGame boardGame) {
        return boardGameService.createGame(boardGame);
    }

    // PUT: Update an existing board game
    @PutMapping("/{id}")
    public BoardGame updateBoardGame(@PathVariable Long id, @RequestBody BoardGame boardGame) {
        return boardGameService.updateGame(id, boardGame);
    }

    // GET: List all board games
    @GetMapping
    public List<BoardGame> getAllBoardGames() {
        return boardGameService.getAllGames();
    }

    // GET: Get a board game by ID
    @GetMapping("/{id}")
    public Optional<BoardGame> getByIdBoardGames(@PathVariable Long id) {
        return boardGameService.getByIdGames(id);
    }

    // DELETE: Delete a board game by ID
    @DeleteMapping("/{gameName}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBoardGame(@PathVariable String gameName) {
        boardGameService.deleteGame(gameName);
    }

    // PATCH: Reduce stock for a board game
    @PatchMapping("/reduce-stock/{gameName}")
    public ResponseEntity<?> reduceStock(@PathVariable String gameName) {
        try {
            boardGameService.reduceStock(gameName); // เรียก service เพื่ออัปเดต stock
            return ResponseEntity.ok("Stock reduced successfully for game: " + gameName);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
