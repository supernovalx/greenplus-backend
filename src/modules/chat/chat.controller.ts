import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorator/auth.decorator';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ConversationDto } from './dto/conversation.dto';
import { MessageRepository } from './message.repository';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private messageRepository: MessageRepository) {}

  @Auth()
  @Get('conversations')
  @ApiOperation({ summary: 'Find all conversations of user' })
  async getConversations(
    @CurrentUser() user: User,
  ): Promise<ConversationDto[]> {}
}
