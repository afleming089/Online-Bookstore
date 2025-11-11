package com.mycompany.app.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security configuration: allows public reads and protects writes.
 * Uses in-memory users for demo purposes.
 */
@Configuration
public class SecurityConfig {

  // Bypass the filter chain for GET/HEAD /books so reads never challenge
  @Bean
  public WebSecurityCustomizer webSecurityCustomizer() {
    return web -> web.ignoring()
      .requestMatchers(HttpMethod.GET, "/books", "/books/**")
      .requestMatchers(HttpMethod.HEAD, "/books", "/books/**");
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
      .csrf(csrf -> csrf.disable())
      .authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .requestMatchers(HttpMethod.GET, "/", "/home", "/error").permitAll()
        .anyRequest().authenticated()
      )
      .httpBasic(Customizer.withDefaults())
      .build();
  }

  @Bean
  public UserDetailsService users() {
    UserDetails admin   = User.withUsername("admin").password("{noop}admin123").roles("ADMIN").build();
    UserDetails shopper = User.withUsername("shopper").password("{noop}shopper123").roles("SHOPPER").build();
    return new InMemoryUserDetailsManager(admin, shopper);
  }
}
