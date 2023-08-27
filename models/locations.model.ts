export interface Location {
    referencePosition: ReferencePosition;
    address:           Address;
    formattedAddress:  string;
    locationType:      string;
    quality:           Quality;
}

export interface Address {
    countryName: string;
    state:       string;
    province:    string;
    postalCode:  string;
    city:        string;
    district:    string;
    subdistrict: string;
    street:      string;
    houseNumber: string;
}

export interface Quality {
    totalScore: number;
}

export interface ReferencePosition {
    latitude:  number;
    longitude: number;
}
