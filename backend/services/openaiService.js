const { OpenAI } = require('openai');

// Regular Expression based fallback parser if OpenAI API key is missing or fails
function parseWithRegex(text) {
  console.log('Using regex fallback for WhatsApp parsing');
  
  const customerName = (text.match(/(?:Name|Customer|Client):\s*([^\n\r]+)/i) || ['', ''])[1].trim();
  const phone = (text.match(/(?:Phone|Mobile|Contact|Tel):\s*([^\n\r]+)/i) || ['', ''])[1].trim();
  const pickupAddress = (text.match(/(?:Pickup Address|From Address|Source Address|Pickup):\s*([^\n\r]+)/i) || ['', ''])[1].trim();
  const deliveryAddress = (text.match(/(?:Delivery Address|To Address|Dest Address|To):\s*([^\n\r]+)/i) || ['', ''])[1].trim();
  
  // Try to parse cities
  const pickupCity = (text.match(/(?:Pickup City|From City|Source City|From):\s*([^\n\r]+)/i) || ['', ''])[1].trim() || pickupAddress.split(',').pop().trim();
  const deliveryCity = (text.match(/(?:Delivery City|To City|Dest City|To):\s*([^\n\r]+)/i) || ['', ''])[1].trim() || deliveryAddress.split(',').pop().trim();
  
  const truckNumber = (text.match(/(?:Truck|Vehicle|Lorry|Truck No):\s*([^\n\r]+)/i) || ['', ''])[1].trim();
  
  const rawAmount = (text.match(/(?:Amount|Price|Cost|Charges|Rate|Freight):\s*([0-9,.]+)/i) || ['', ''])[1].trim();
  const amount = parseFloat(rawAmount.replace(/,/g, '')) || 0;
  
  const amountInWords = (text.match(/(?:Amount in words|In words):\s*([^\n\r]+)/i) || ['', ''])[1].trim();
  const goodsDescription = (text.match(/(?:Goods|Items|Description|Material):\s*([^\n\r]+)/i) || ['', ''])[1].trim();
  const weight = (text.match(/(?:Weight|Qty|Quantity):\s*([^\n\r]+)/i) || ['', ''])[1].trim();
  const paymentMode = (text.match(/(?:Payment|Pay Mode|Payment Mode):\s*([^\n\r]+)/i) || ['', ''])[1].trim() || 'Cash';
  
  const lrNumber = (text.match(/(?:LR|LR No|Lorry Receipt):\s*([^\n\r]+)/i) || ['', ''])[1].trim();
  const invoiceNumber = (text.match(/(?:Invoice|Inv|Bill No):\s*([^\n\r]+)/i) || ['', ''])[1].trim();
  const receiptNumber = (text.match(/(?:Receipt|Rec No|Receipt No):\s*([^\n\r]+)/i) || ['', ''])[1].trim();
  const deliveryType = (text.match(/(?:Delivery Type|Type):\s*([^\n\r]+)/i) || ['', ''])[1].trim() || 'Door Delivery';

  return {
    customerName,
    phone,
    pickupAddress: pickupAddress || pickupCity,
    deliveryAddress: deliveryAddress || deliveryCity,
    pickupCity,
    deliveryCity,
    truckNumber,
    amount,
    amountInWords,
    goodsDescription,
    weight,
    paymentMode,
    lrNumber,
    invoiceNumber,
    receiptNumber,
    deliveryType
  };
}

async function extractShipmentDetails(whatsappText) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY' || apiKey.trim() === '') {
    return parseWithRegex(whatsappText);
  }

  try {
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an operational assistant for a logistics company. You extract shipment information from WhatsApp messages and return a raw JSON object.
Do not wrap JSON in markdown block. Return ONLY the JSON object.

The output JSON must contain exactly these keys (and format matching the specifications):
{
  "customerName": "String",
  "phone": "String",
  "pickupAddress": "String",
  "deliveryAddress": "String",
  "pickupCity": "String",
  "deliveryCity": "String",
  "truckNumber": "String",
  "amount": Number,
  "amountInWords": "String",
  "goodsDescription": "String",
  "weight": "String",
  "paymentMode": "String",
  "lrNumber": "String",
  "invoiceNumber": "String",
  "receiptNumber": "String",
  "deliveryType": "String"
}

Parsing Guidelines:
- If a value is missing, return an empty string "" (or 0 for amount).
- Use context clues: e.g. "From: Bhopal" -> pickupCity: "Bhopal", and if no other pickupAddress, make pickupAddress: "Bhopal".
- If amount is provided (e.g. 42000), compute amountInWords (e.g. "Forty Two Thousand Rupees Only") unless it is explicitly specified.
- Try to infer a standard paymentMode (e.g., Cash, Bank Transfer, GPay, ToPay, COD) and deliveryType (e.g., Door Delivery, Office Delivery).`
        },
        {
          role: 'user',
          content: whatsappText
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const parsedJson = JSON.parse(response.choices[0].message.content);
    return parsedJson;
  } catch (error) {
    console.error('Error with OpenAI extraction:', error);
    return parseWithRegex(whatsappText);
  }
}

module.exports = {
  extractShipmentDetails
};
