import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

interface Quote {
  author: string;
  book: string;
  quote: string;
  publisher: string;
  date: string;
}

const App: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('http://localhost:8080/quotes');
        const data = await response.json();

        setQuotes(data.data);
      } catch (err) {
        console.error('Error fetching quotes:', err);
      } finally {
        setLoading(false);
      }
    };
    // TODO: prevent double fetching for reload
    fetchQuotes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (Array.isArray(quotes) && quotes.length === 0) {
    setError('Error fetching quotes');
  }

  return (
    <Container className="mt-5">
      <h3>Book Quotes</h3>
      <Row>
        {quotes.map((quote, index) => (
          <Col md={4} key={index} className="mb-4">
            <Card bg="light" text="dark" border="secondary" className="h-100">
              <Card.Body>
                <Card.Title>{quote.book}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">by {quote.author}</Card.Subtitle>
                <Card.Text>"{quote.quote}"</Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  Published by {quote.publisher} on {quote.date}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default App;
