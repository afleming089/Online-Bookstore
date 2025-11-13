package com.mycompany.app.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

  /**
   * Publicly allows GET/HEAD requests to /books
   */
  @Bean
  public WebSecurityCustomizer webSecurityCustomizer() {
    return web -> web.ignoring()
        .requestMatchers(HttpMethod.GET, "/books", "/books/**")
        .requestMatchers(HttpMethod.HEAD, "/books", "/books/**");
  }

  /**
   * Main filter chain for authentication and authorization rules.
   */
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable()) // disable CSRF for simplicity
        .cors(cors -> {
        }) // enable CORS
        .authorizeHttpRequests(auth -> auth
            // allow unauthenticated access to login/signup endpoints
            .requestMatchers(HttpMethod.POST, "/auth/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/auth/**").permitAll()

            // allow public GET endpoints
            .requestMatchers(HttpMethod.GET, "/", "/home", "/error", "/test").permitAll()
            .requestMatchers(HttpMethod.GET, "/books", "/books/**").permitAll()

            .requestMatchers(HttpMethod.GET, "/auth/cart/").permitAll()
            .requestMatchers(HttpMethod.POST, "/auth/cart/").permitAll()

            // allow preflight requests
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

            // everything else requires authentication
            .anyRequest().authenticated())
        .build();
  }
}
