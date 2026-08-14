async function insertRow(table, row, options = {}) {
  const projectUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!projectUrl || !secretKey) {
    throw new Error('Supabase server configuration is unavailable');
  }

  const preferDirectives = [];
  preferDirectives.push(options.returnRepresentation ? 'return=representation' : 'return=minimal');
  if (options.ignoreDuplicates) preferDirectives.push('resolution=ignore-duplicates');

  const headers = {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    'Content-Type': 'application/json',
    Prefer: preferDirectives.join(',')
  };

  const response = await fetch(`${projectUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(row),
    signal: AbortSignal.timeout(8000)
  });

  if (response.ok) {
    const rows = options.returnRepresentation ? await response.json() : [];
    return { row: rows[0] || null };
  }
  const message = await response.text();
  throw new Error(`Supabase insert failed (${response.status}): ${message.slice(0, 300)}`);
}

module.exports = { insertRow };
