import { databases } from './appwrite.config'; // Make sure this path is correct

export type AttributeConfig = {
  type: any;
  size?: number;
  required?: boolean;
  options?: string[];
};

type Schema = Record<string, AttributeConfig>;

export async function ensureAttributesExist(
  databaseId: string,
  collectionId: string,
  schema: Schema
) {
  const existingAttributes = await databases.listAttributes(databaseId, collectionId);
  const existingAttributeIds = existingAttributes.attributes.map((attr:any) => attr.key);

  const createAttribute = async (key: string, config: AttributeConfig) => {
    const isRequired = config.required ?? false;

    switch (config.type) {
      case 'string':
        await databases.createStringAttribute(databaseId, collectionId, key, config.size || 256, isRequired);
        break;
      case 'email':
        // Appwrite doesn't have a native email type; treat it as string
        await databases.createStringAttribute(databaseId, collectionId, key, 256, isRequired);
        break;
      case 'datetime':
        await databases.createDatetimeAttribute(databaseId, collectionId, key, isRequired);
        break;
      case 'boolean':
        await databases.createBooleanAttribute(databaseId, collectionId, key, isRequired);
        break;
      case 'enum':
        if (!config.options || !Array.isArray(config.options)) {
          throw new Error(`Enum attribute "${key}" requires an 'options' array`);
        }
        await databases.createEnumAttribute(databaseId, collectionId, key, config.options, isRequired);
        break;
      default:
        throw new Error(`Unsupported attribute type: ${config.type}`);
    }
  };

  for (const [key, config] of Object.entries(schema)) {
    if (!existingAttributeIds.includes(key)) {
      await createAttribute(key, config);
      console.log(`Created attribute: ${key}`);
    } else {
      console.log(`Attribute already exists: ${key}`);
    }
  }
}
