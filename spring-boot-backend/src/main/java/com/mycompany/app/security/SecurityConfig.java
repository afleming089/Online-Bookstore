package com.mycompany.app.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
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
            .csrf(csrf -> csrf.disable())   // disable CSRF for simplicity
            .cors(cors -> {})               // enable CORS
            .authorizeHttpRequests(auth -> auth
                    // allow unauthenticated access to login/signup endpoints
                    .requestMatchers(HttpMethod.POST, "/auth/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/auth/**").permitAll()

                    // allow public GET endpoints
                    .requestMatchers(HttpMethod.GET, "/", "/home", "/error", "/test").permitAll()
                    .requestMatchers(HttpMethod.GET, "/books", "/books/**").permitAll()

                    // admin-only inventory/order management
                    .requestMatchers(HttpMethod.GET, "/inventory", "/inventory/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/inventory", "/inventory/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/inventory", "/inventory/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/orders/checkout").hasAnyRole("ADMIN", "SHOPPER")
                    .requestMatchers(HttpMethod.GET, "/orders", "/orders/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/orders", "/orders/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PATCH, "/orders", "/orders/**").hasRole("ADMIN")

                    // allow preflight requests
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                    // everything else requires authentication
                    .anyRequest().authenticated()
            )
            .httpBasic(withDefaults -> {})
            .build();
  }

  @Bean
  public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
    UserDetails admin = User.withUsername("admin")
            .password(passwordEncoder.encode("admin123"))
            .roles("ADMIN")
            .build();

    UserDetails shopper = User.withUsername("shopper")
            .password(passwordEncoder.encode("shopper123"))
            .roles("SHOPPER")
            .build();

    return new InMemoryUserDetailsManager(admin, shopper);
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
