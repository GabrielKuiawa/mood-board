import BadRequestException from "../exception/BadRequestException";
import {
  PinSearchFilters,
  SearchTargetType,
  searchTargetTypes,
} from "../types/Search";
import { validateId, validateTextField } from "./validation";

export function validateSearchQuery(
  value: unknown,
  options: { optional?: boolean; allowEmpty?: boolean } = {},
): string | undefined {
  if (value === undefined && options.optional) {
    return undefined;
  }

  if (options.allowEmpty && value === "") {
    return "";
  }

  return validateTextField(value, "Busca", 100);
}

export function validatePinSearchFilters(
  queryValue: unknown,
  typeValue: unknown,
  idValue: unknown,
): PinSearchFilters {
  const query = validateSearchQuery(queryValue, { optional: true });

  if (typeValue === undefined && idValue === undefined) {
    return { query };
  }

  if (typeof typeValue !== "string" || !isSearchTargetType(typeValue)) {
    throw new BadRequestException(
      `type deve ser um dos valores: ${searchTargetTypes.join(", ")}.`,
    );
  }

  if (idValue === undefined) {
    throw new BadRequestException("id é obrigatório quando type é informado.");
  }

  return {
    query,
    target: {
      type: typeValue,
      id: validateId(idValue),
    },
  };
}

function isSearchTargetType(value: string): value is SearchTargetType {
  return searchTargetTypes.includes(value as SearchTargetType);
}
