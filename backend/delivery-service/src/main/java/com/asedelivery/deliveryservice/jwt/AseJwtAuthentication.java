package com.asedelivery.deliveryservice.jwt;

import com.asedelivery.deliveryservice.model.Role;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;

public class AseJwtAuthentication extends AbstractAuthenticationToken {

    private final String email;

    private final String token;

    private final Role role;

    public AseJwtAuthentication(Role role, String email, String token) {
        super(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name())));
        this.email = email;
        this.token = token;
        this.role = role;
    }

    @Override
    public Object getCredentials() {
        return this.token;
    }

    @Override
    public Object getPrincipal() {
        return this.email;
    }

    public Role getRole() {
        return this.role;
    }
}
