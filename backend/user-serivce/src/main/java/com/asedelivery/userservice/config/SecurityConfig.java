package com.asedelivery.userservice.config;

import com.asedelivery.userservice.filter.JwtRequestFilter;
import com.asedelivery.userservice.jwt.JwtAuthenticationProvider;
import com.asedelivery.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.authentication.logout.CookieClearingLogoutHandler;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.NegatedRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private JwtAuthenticationProvider jwtAuthenticationProvider;

    private UserService userService;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public SecurityConfig(BCryptPasswordEncoder passwordEncoder, JwtAuthenticationProvider jwtAuthenticationProvider, UserService userService) {
        this.bCryptPasswordEncoder = passwordEncoder;
        this.userService = userService;
        this.jwtAuthenticationProvider = jwtAuthenticationProvider;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf()
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringAntMatchers("/auth/csrf").and()
                .formLogin().disable()
                .authorizeRequests() // 2. Require authentication in all endpoints except login
                .antMatchers("/auth/login").permitAll() //Allow basic authentication for login
                .antMatchers("/auth/csrf").permitAll() //Allow no auth for csrf token
                .anyRequest().authenticated()
                .and()
                .logout()
                .logoutUrl("/auth/logout")
                .addLogoutHandler(new CookieClearingLogoutHandler("jwt", "XSRF-TOKEN"))
                .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler())
                .and()
                .addFilterBefore(getBasicAuthenticationFilter(), AnonymousAuthenticationFilter.class)
                .addFilterBefore(getJwtRequestFilter(), BasicAuthenticationFilter.class)
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        ;
    }

    private RequestMatcher getRequestMatchers() {
        return new NegatedRequestMatcher(
                new OrRequestMatcher(
                        new AntPathRequestMatcher("/auth/login"),
                        new AntPathRequestMatcher("/auth/csrf")
                )
        );
    }

    private JwtRequestFilter getJwtRequestFilter() throws Exception {
        return new JwtRequestFilter(getRequestMatchers(), authenticationManager());
    }

    private BasicAuthenticationFilter getBasicAuthenticationFilter() throws Exception {
        return new BasicAuthenticationFilter(authenticationManager());
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(jwtAuthenticationProvider);
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userService);
        daoAuthenticationProvider.setPasswordEncoder(bCryptPasswordEncoder);
        auth.authenticationProvider(daoAuthenticationProvider);
    }

    @Override
    @Bean
    // Define an authentication manager to execute authentication services
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}