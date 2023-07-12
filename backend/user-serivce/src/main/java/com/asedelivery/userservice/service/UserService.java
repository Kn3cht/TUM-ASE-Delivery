package com.asedelivery.userservice.service;

import com.asedelivery.userservice.model.AseUser;
import com.asedelivery.userservice.model.Role;
import com.asedelivery.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    public Optional<AseUser> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<AseUser> findCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails)principal).getUsername();
        } else {
            email = principal.toString();
        }
        return userRepository.findByEmail(email);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository
                .findByEmail(email).map(aseUser -> new User(
                        aseUser.getEmail(),
                        aseUser.getPassword(),
                        roleToAuthority(aseUser.getRole()))
                )
                .orElseThrow(() ->
                        new UsernameNotFoundException("User with email " + email + " not found")
                );
    }

    public List<AseUser> getAllUsers() {
        return userRepository.findAll();
    }

    public AseUser createUser(AseUser aseUser) {
        return userRepository.insert(aseUser);
    }

    public Optional<AseUser> updateUser(AseUser user) {
        Optional<AseUser> userOptional = userRepository.findById(user.getId());

        if (userOptional.isPresent()) {
            AseUser toUpdateUser = userOptional.get();
            toUpdateUser.setEmail(user.getEmail());
            toUpdateUser.setPassword(user.getPassword());
            toUpdateUser.setRole(user.getRole());
            return Optional.of(userRepository.save(toUpdateUser));
        }
        return Optional.empty();
    }

    public Optional<String> deleteUser(String id) {
        if (userRepository.findById(id).isPresent()) {
            userRepository.deleteById(id);
            return Optional.of(id);
        }
            return Optional.empty();
    }
    private Collection<GrantedAuthority> roleToAuthority(Role role) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
}
