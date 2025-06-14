package com.salesapp.auth.web;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.salesapp.auth.entities.AppRole;
import com.salesapp.auth.entities.AppUser;
import com.salesapp.auth.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserServiceREST {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    private static final String PREFIXE_JWT = "Bearer ";
    private static final String CLE_SIGNATURE = "MaClé";

    public UserServiceREST(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // 1. Get all users (accessible by ROLE_USER and ROLE_ADMIN)
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public List<AppUser> getAllUsers() {
        List<AppUser> users = userService.getAllUsers();
        if (users.isEmpty()) {
            throw new RuntimeException("No users found!");
        }
        return users;
    }

    // 2. Add user (admin only)
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> addUser(@RequestBody AppUser appUser) {
        if (userService.getUserByName(appUser.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username already exists."));
        }
        if (appUser.getRoles() == null || appUser.getRoles().isEmpty()) {
            AppRole userRole = userService.getRoleByName("ROLE_USER");
            appUser.getRoles().add(userRole);
        }
        // Encode password before saving
        appUser.setPassword(passwordEncoder.encode(appUser.getPassword()));

        AppUser savedUser = userService.addUser(appUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // 3. Login user
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String rawPassword = credentials.get("password");

        AppUser user = userService.getUserByName(username);
        if (user == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        }

        Algorithm algorithm = Algorithm.HMAC256(CLE_SIGNATURE);

        String[] roles = user.getRoles().stream()
                .map(AppRole::getRoleName)
                .toArray(String[]::new);

        String accessToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + 10 * 60 * 1000)) // 10 minutes
                .withIssuer("http://localhost:8085")
                .withArrayClaim("roles", roles)
                .sign(algorithm);

        String refreshToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + 60 * 60 * 1000)) // 1 hour
                .withIssuer("http://localhost:8085")
                .sign(algorithm);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("access-token", accessToken);
        tokens.put("refresh-token", refreshToken);

        return ResponseEntity.ok(tokens);
    }

    // 4. Register new user (open registration, default role USER)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AppUser appUser) {
        if (userService.getUserByName(appUser.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username already exists."));
        }
        AppRole userRole = userService.getRoleByName("ROLE_USER");
        appUser.getRoles().add(userRole);

        // Encode password before saving
        appUser.setPassword(passwordEncoder.encode(appUser.getPassword()));

        AppUser savedUser = userService.addUser(appUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // 5. Register admin (only admin can do this)
    @PostMapping("/register-admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> registerAdmin(@RequestBody AppUser appUser) {
        if (userService.getUserByName(appUser.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username already exists."));
        }
        AppRole adminRole = userService.getRoleByName("ROLE_ADMIN");
        appUser.getRoles().add(adminRole);

        // Encode password before saving
        appUser.setPassword(passwordEncoder.encode(appUser.getPassword()));

        AppUser savedAdmin = userService.addUser(appUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAdmin);
    }

    // 6. Refresh JWT token
    @GetMapping(path = "/refreshToken")
    public void refreshToken(HttpServletRequest request,
                             HttpServletResponse response) throws IOException {
        String refreshToken = request.getHeader("Authorization");

        if (refreshToken != null && refreshToken.startsWith(PREFIXE_JWT)) {
            try {
                String jwtRefresh = refreshToken.substring(PREFIXE_JWT.length());
                Algorithm algo = Algorithm.HMAC256(CLE_SIGNATURE);
                JWTVerifier jwtVerifier = JWT.require(algo).build();
                DecodedJWT decodedJWT = jwtVerifier.verify(jwtRefresh);
                String username = decodedJWT.getSubject();

                AppUser user = userService.getUserByName(username);

                String[] roles = user.getRoles().stream()
                        .map(AppRole::getRoleName)
                        .toArray(String[]::new);

                String jwtAccessToken = JWT.create()
                        .withSubject(user.getUsername())
                        .withExpiresAt(new Date(System.currentTimeMillis() + 60 * 1000)) // 1 min
                        .withIssuer(request.getRequestURL().toString())
                        .withArrayClaim("roles", roles)
                        .sign(algo);

                Map<String, String> mapTokens = new HashMap<>();
                mapTokens.put("access-token", jwtAccessToken);
                mapTokens.put("refresh-token", jwtRefresh);

                response.setContentType("application/json");
                new ObjectMapper().writeValue(response.getOutputStream(), mapTokens);

            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"" + e.getMessage().replace("\"", "'") + "\"}");
            }
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Refresh token is missing or malformed\"}");
        }
    }
}
