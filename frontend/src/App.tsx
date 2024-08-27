import React, { useState, useEffect } from 'react';
import { Container, Button, Card } from 'react-bootstrap';

const App: React.FC = () => {
  const [quote, setQuote] = useState<string>('');
  const [author, setAuthor] = useState<string>('');

  const fetchQuote = async () => {
    const response = await fetch('http://localhost:8080/random-quote');
    const data = await response.json();
    setQuote(data.quote);
    setAuthor(data.author);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <Card.Text>{quote}</Card.Text>
          <footer className="blockquote-footer">{author}</footer>
        </Card.Body>
      </Card>
      <Button className="mt-3" onClick={fetchQuote}>
        New Quote
      </Button>
    </Container>
  );
};

export default App;
