
package com.eventsphere.eventspere.service;

import com.eventsphere.eventspere.entity.Event;
import com.eventsphere.eventspere.entity.User;

public interface EmailService {

    void sendRegistrationConfirmation(User user, Event event);

    void sendRegistrationCancellation(User user, Event event);
}
