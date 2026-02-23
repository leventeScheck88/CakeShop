import { Repository } from 'typeorm';
import { ContactMessage } from './entities/contact-message.entity';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactService {
    private readonly contactRepo;
    constructor(contactRepo: Repository<ContactMessage>);
    create(createContactDto: CreateContactDto): Promise<ContactMessage>;
}
