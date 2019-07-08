package com.steponeit.dentalone.appointments.services;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Component
@Slf4j
public class TurnEaterService {
    protected Integer servers;
    protected List<Customer> customers;
    protected Date systemTime;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void updateQueue() {
        List<Customer> beingServed = customers.stream().filter(Customer::isBeingServed).collect(Collectors.toList());
        List<Customer> waiting = customers.stream().filter(c -> !c.isBeingServed()).collect(Collectors.toList());
        updateBeingServed(beingServed);

        List<Customer> back = extract(waiting, servers);
        log.info("en servicio {}, espera {}, back {}", beingServed.size(), waiting.size(), back.size());
        waiting.removeAll(back);
        List<Customer> front = beingServed;

        updateWaiting(back, front);

        while (!waiting.isEmpty()) {
            //update back
            front = back;
            back = extract(waiting, servers);
            waiting.removeAll(back);
            log.info("En espera, {}", waiting.size());
            updateWaiting(back, front);
        }
    }

    private void updateBeingServed(List<Customer> beingServed) {
        for (Customer c : beingServed) {
            c.setCalculatedQueuePosition(0);
            c.setCalculatedTime(c.estimatedTimeLeft());
            //update served db
        }
    }

    private void updateWaiting(List<Customer> waiting, List<Customer> inFront) {
        for (Customer c : waiting) {
            Customer next = popLowest(inFront);
            c.setCalculatedQueuePosition(next.getCalculatedQueuePosition() + 1);
            c.setCalculatedTime(c.estimatedTimeLeft() + next.getCalculatedTime());
            c.setBehindName(next.getName());
        }
    }

    private Customer popLowest(List<Customer> customers) {
        if (customers.isEmpty()) {
            return null;
        }
        Optional<Customer> customerOptional = customers.stream()
                .sorted(Comparator.comparingLong(Customer::getCalculatedTime))
                .findFirst();
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            customers.remove(customer);
            return customer;
        } else {
            return null;
        }
    }

    public Integer getServers() {
        return servers;
    }

    public List<Customer> getCustomersInQueue() {
        return customers;
    }

    public static List<Customer> extract(List<Customer> customers, Integer servers) {
        List<Customer> ilTriello = new ArrayList<>();
        for (int i = 0; i < customers.size() && i < servers; i++) {
            ilTriello.add(customers.get(i));
        }
        return ilTriello;
    }

    public Customer createCustomer(String name, Date startedService, long calculatedTime) {
        return new Customer(name, calculatedTime, startedService);
    }

    @Data
    public class Customer {
        private final String name;
        private final Long servicesTime;
        private Date dateEntered;
        private Date dateStartedService;
        private Integer calculatedQueuePosition;
        private Long calculatedTime;
        private boolean beingServed = false;
        private String behindName;

        public Customer(String name, Long servicesTime, Date dateStartedService) {
            this.name = name;
            this.servicesTime = servicesTime;
            this.dateStartedService = dateStartedService;
        }

        public Long estimatedTimeLeft() {
            if (dateStartedService == null) {
                return servicesTime;
            } else {
                return servicesTime - (systemTime.getTime() - dateStartedService.getTime()) / 1000;
            }
        }
    }
}
