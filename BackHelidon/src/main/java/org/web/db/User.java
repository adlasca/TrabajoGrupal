package org.web.db;

import lombok.Builder;

@Builder
public record User (Integer id, String name,String username,
                        String email, String addressStreet, String addressSuite,
                    String addressCity, String addressZipcode, String addressGeoLat,
                    String addressGeoLng, String phone,String website, String companyName,
                    String companyCatchPhrase, String companyBs) {
}
