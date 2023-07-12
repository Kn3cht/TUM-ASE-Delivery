package com.asedelivery.deliveryservice.jwt;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthenticationProvider implements AuthenticationProvider {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationProvider(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String jwt = (String) authentication.getPrincipal();

        if (!jwtUtil.verifyJwtSignature(jwt)) {
            throw new AccessDeniedException("Invalid signature");
        }

        var email = jwtUtil.extractEmail(jwt);
        var role = jwtUtil.extractRole(jwt);

        AseJwtAuthentication aseJwtAuthentication = new AseJwtAuthentication(role, email, jwt);
        aseJwtAuthentication.setAuthenticated(true);
        return aseJwtAuthentication;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return PreAuthenticatedAuthenticationToken.class.equals(authentication);
    }
}
