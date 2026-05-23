package com.shopbm.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {

    private final SecretKey key;
    private final long accessTokenMillis;
    private final long refreshTokenMillis;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-token-ttl-minutes}") long accessMinutes,
            @Value("${app.jwt.refresh-token-ttl-days}") long refreshDays
    ) {
        byte[] keyBytes = secret.length() >= 64
                ? secret.getBytes(StandardCharsets.UTF_8)
                : Decoders.BASE64.decode(java.util.Base64.getEncoder().encodeToString(secret.getBytes(StandardCharsets.UTF_8)));
        this.key = Keys.hmacShaKeyFor(padKey(keyBytes));
        this.accessTokenMillis = accessMinutes * 60 * 1000;
        this.refreshTokenMillis = refreshDays * 24 * 60 * 60 * 1000;
    }

    private byte[] padKey(byte[] in) {
        if (in.length >= 64) return in;
        byte[] out = new byte[64];
        System.arraycopy(in, 0, out, 0, in.length);
        for (int i = in.length; i < 64; i++) out[i] = 0x42;
        return out;
    }

    public String generateAccessToken(Long userId, String username, String role) {
        Date now = new Date();
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claims(Map.of("username", username, "role", role))
                .issuedAt(now)
                .expiration(new Date(now.getTime() + accessTokenMillis))
                .signWith(key)
                .compact();
    }

    public String generateRefreshTokenPlain() {
        return UUID.randomUUID().toString() + "-" + UUID.randomUUID();
    }

    public long getRefreshTokenMillis() {
        return refreshTokenMillis;
    }

    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    public Long getUserId(String token) {
        return Long.parseLong(parse(token).getSubject());
    }

    public static String sha256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
