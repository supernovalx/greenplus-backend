import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorator/paginated.decorator';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ConversationDto } from './dto/conversation.dto';
import { FindAllMessageQueryDto } from './dto/find-all-message.dto';
import { MessageDto } from './dto/message.dto';
import { MessageService } from './message.service';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private messageService: MessageService) {}

  @Auth()
  @Get('conversations')
  @ApiOperation({ summary: 'Find all conversations of user' })
  async getConversations(
    @CurrentUser() user: User,
  ): Promise<ConversationDto[]> {
    // @ts-ignore
    return await this.messageService.getConversations(user);
  }

  @Auth()
  @Get(':receiverId/messages')
  @ApiOperation({ summary: 'Find all messages sent to a receiver' })
  @ApiPaginatedResponse(MessageDto)
  async getMessage(
    @CurrentUser() user: User,
    @Param('receiverId', ParseIntPipe) receiverId: number,
    @Query() findAllMessageDto: FindAllMessageQueryDto,
  ): Promise<PaginatedDto<MessageDto>> {
    // Find all messages
    const [messages, count] = await this.messageService.getMessages(
      user.id,
      receiverId,
      findAllMessageDto,
    );
    const rs: PaginatedDto<MessageDto> = {
      total: count,
      results: messages.map((message) => new MessageDto(message)),
    };

    return rs;
  }

  @Get('/ignore-this-api')
  async test(): Promise<MessageDto> {
    // @ts-ignore
    return;
  }
}
