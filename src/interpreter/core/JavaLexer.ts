export enum TokenType {
  // Literals
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  NULL = 'NULL',
  
  // Identifiers
  IDENTIFIER = 'IDENTIFIER',
  
  // Keywords
  CLASS = 'class',
  PUBLIC = 'public',
  PRIVATE = 'private',
  STATIC = 'static',
  VOID = 'void',
  INT = 'int',
  DOUBLE = 'double',
  BOOLEAN_TYPE = 'boolean',
  STRING_TYPE = 'String',
  IF = 'if',
  ELSE = 'else',
  WHILE = 'while',
  FOR = 'for',
  RETURN = 'return',
  NEW = 'new',
  THIS = 'this',
  TRUE = 'true',
  FALSE = 'false',
  
  // IoT-specific annotations
  DEADLINE = '@Deadline',
  SENSOR = '@Sensor',
  SAFETY_CHECK = '@SafetyCheck',
  REAL_TIME = '@RealTime',
  
  // Operators
  PLUS = '+',
  MINUS = '-',
  MULTIPLY = '*',
  DIVIDE = '/',
  MODULO = '%',
  ASSIGN = '=',
  EQUALS = '==',
  NOT_EQUALS = '!=',
  LESS_THAN = '<',
  GREATER_THAN = '>',
  LESS_EQUAL = '<=',
  GREATER_EQUAL = '>=',
  AND = '&&',
  OR = '||',
  NOT = '!',
  INCREMENT = '++',
  DECREMENT = '--',
  
  // Delimiters
  SEMICOLON = ';',
  COMMA = ',',
  DOT = '.',
  LEFT_PAREN = '(',
  RIGHT_PAREN = ')',
  LEFT_BRACE = '{',
  RIGHT_BRACE = '}',
  LEFT_BRACKET = '[',
  RIGHT_BRACKET = ']',
  
  // Special
  ANNOTATION = '@',
  EOF = 'EOF',
  NEWLINE = 'NEWLINE',
  WHITESPACE = 'WHITESPACE',
  COMMENT = 'COMMENT'
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  startIndex: number;
  endIndex: number;
}

export class JavaLexer {
  private source: string;
  private tokens: Token[] = [];
  private start = 0;
  private current = 0;
  private line = 1;
  private column = 1;

  private keywords: Map<string, TokenType> = new Map([
    ['class', TokenType.CLASS],
    ['public', TokenType.PUBLIC],
    ['private', TokenType.PRIVATE],
    ['static', TokenType.STATIC],
    ['void', TokenType.VOID],
    ['int', TokenType.INT],
    ['double', TokenType.DOUBLE],
    ['boolean', TokenType.BOOLEAN_TYPE],
    ['String', TokenType.STRING_TYPE],
    ['if', TokenType.IF],
    ['else', TokenType.ELSE],
    ['while', TokenType.WHILE],
    ['for', TokenType.FOR],
    ['return', TokenType.RETURN],
    ['new', TokenType.NEW],
    ['this', TokenType.THIS],
    ['true', TokenType.TRUE],
    ['false', TokenType.FALSE],
    ['null', TokenType.NULL]
  ]);

  private iotAnnotations: Map<string, TokenType> = new Map([
    ['@Deadline', TokenType.DEADLINE],
    ['@Sensor', TokenType.SENSOR],
    ['@SafetyCheck', TokenType.SAFETY_CHECK],
    ['@RealTime', TokenType.REAL_TIME]
  ]);

  constructor(source: string) {
    this.source = source;
  }

  tokenize(): Token[] {
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
    this.column = 1;

    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push({
      type: TokenType.EOF,
      value: '',
      line: this.line,
      column: this.column,
      startIndex: this.current,
      endIndex: this.current
    });

    return this.tokens;
  }

  private scanToken(): void {
    const startColumn = this.column;
    const c = this.advance();

    switch (c) {
      case ' ':
      case '\r':
      case '\t':
        // Skip whitespace
        break;
      case '\n':
        this.line++;
        this.column = 1;
        break;
      case '(':
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ')':
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case '{':
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case '}':
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case '[':
        this.addToken(TokenType.LEFT_BRACKET);
        break;
      case ']':
        this.addToken(TokenType.RIGHT_BRACKET);
        break;
      case ',':
        this.addToken(TokenType.COMMA);
        break;
      case '.':
        this.addToken(TokenType.DOT);
        break;
      case ';':
        this.addToken(TokenType.SEMICOLON);
        break;
      case '@':
        this.annotation();
        break;
      case '+':
        if (this.match('+')) {
          this.addToken(TokenType.INCREMENT);
        } else {
          this.addToken(TokenType.PLUS);
        }
        break;
      case '-':
        if (this.match('-')) {
          this.addToken(TokenType.DECREMENT);
        } else {
          this.addToken(TokenType.MINUS);
        }
        break;
      case '*':
        this.addToken(TokenType.MULTIPLY);
        break;
      case '/':
        if (this.match('/')) {
          this.singleLineComment();
        } else if (this.match('*')) {
          this.multiLineComment();
        } else {
          this.addToken(TokenType.DIVIDE);
        }
        break;
      case '%':
        this.addToken(TokenType.MODULO);
        break;
      case '!':
        this.addToken(this.match('=') ? TokenType.NOT_EQUALS : TokenType.NOT);
        break;
      case '=':
        this.addToken(this.match('=') ? TokenType.EQUALS : TokenType.ASSIGN);
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS_THAN);
        break;
      case '>':
        this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER_THAN);
        break;
      case '&':
        if (this.match('&')) {
          this.addToken(TokenType.AND);
        }
        break;
      case '|':
        if (this.match('|')) {
          this.addToken(TokenType.OR);
        }
        break;
      case '"':
        this.string();
        break;
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          // Skip unknown characters
        }
        break;
    }
  }

  private annotation(): void {
    const startPos = this.current - 1;
    
    // Read the annotation name
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }
    
    const text = this.source.substring(startPos, this.current);
    const type = this.iotAnnotations.get(text) || TokenType.ANNOTATION;
    
    this.addToken(type, text);
  }

  private singleLineComment(): void {
    const startPos = this.start;
    while (this.peek() !== '\n' && !this.isAtEnd()) {
      this.advance();
    }
    
    const comment = this.source.substring(startPos, this.current);
    this.addToken(TokenType.COMMENT, comment);
  }

  private multiLineComment(): void {
    const startPos = this.start;
    
    while (!this.isAtEnd()) {
      if (this.peek() === '*' && this.peekNext() === '/') {
        this.advance(); // consume '*'
        this.advance(); // consume '/'
        break;
      }
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      this.advance();
    }
    
    const comment = this.source.substring(startPos, this.current);
    this.addToken(TokenType.COMMENT, comment);
  }

  private string(): void {
    const startPos = this.start;
    
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      throw new Error(`Unterminated string at line ${this.line}`);
    }

    this.advance(); // closing "
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  private number(): void {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance(); // consume '.'
      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    const value = this.source.substring(this.start, this.current);
    this.addToken(TokenType.NUMBER, value);
  }

  private identifier(): void {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const text = this.source.substring(this.start, this.current);
    const type = this.keywords.get(text) || TokenType.IDENTIFIER;
    this.addToken(type, text);
  }

  private isDigit(c: string): boolean {
    return c >= '0' && c <= '9';
  }

  private isAlpha(c: string): boolean {
    return (c >= 'a' && c <= 'z') ||
           (c >= 'A' && c <= 'Z') ||
           c === '_';
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private advance(): string {
    this.column++;
    return this.source.charAt(this.current++);
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;
    this.current++;
    this.column++;
    return true;
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private addToken(type: TokenType, literal?: string): void {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push({
      type,
      value: literal !== undefined ? literal : text,
      line: this.line,
      column: this.column - text.length,
      startIndex: this.start,
      endIndex: this.current
    });
  }
}