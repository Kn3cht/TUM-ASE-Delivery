package com.asedelivery.userservice.filter;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedCredentialsNotFoundException;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;

public class JwtRequestFilter extends AbstractAuthenticationProcessingFilter {

    public JwtRequestFilter(RequestMatcher requestMatcher, AuthenticationManager authenticationManager) {
        super(requestMatcher, authenticationManager);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        //If no cookies are present, throw exception
        if(request.getCookies() == null) {
            throw new PreAuthenticatedCredentialsNotFoundException("No cookies present.");
        }

        //Receive the http Only cookie from the request
        Cookie jwtCookie = Arrays.stream(request.getCookies()).
                filter(cookie -> cookie.getName().equals("jwt")).
                findFirst().
                orElseThrow(() -> new PreAuthenticatedCredentialsNotFoundException("No jwt token present."));

        return getAuthenticationManager().authenticate(new PreAuthenticatedAuthenticationToken(jwtCookie.getValue(), null));
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {
        // Save user principle in security context
        SecurityContextHolder.getContext().setAuthentication(authResult);
        chain.doFilter(request, response);
    }
}


