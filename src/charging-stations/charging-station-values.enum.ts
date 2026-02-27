export enum ChargingStationProperties {
  priceInEuro,
  isAvailableAtHome,
  isAvailableAtWorkPlace,
  isAvailableInPublic,
  id,
  typeId,
  createdAt,
  updatedAt,
}

export enum ChargingStationsPropertiesWithRelations {
  priceInEuro,
  isAvailableAtHome,
  isAvailableAtWorkPlace,
  isAvailableInPublic,
  id,
  typeId,
  createdAt,
  updatedAt,
  trademark,
  model,
  producer,
  current,
  maxPlugsConnected,
  maxPowerUsedInKWh,
  hasWirelessCharging,
}

export enum IntProperties {
  id,
  typeId,
  maxPlugsConnected,
}

export enum FloatProperties {
  priceInEuro,
  maxPowerUsedInKWh,
}

export enum BooleanProperties {
  isAvailableAtHome,
  isAvailableAtWorkPlace,
  isAvailableInPublic,
  hasWirelessCharging,
}

export enum DateProperties {
  createdAt,
  updatedAt,
}
